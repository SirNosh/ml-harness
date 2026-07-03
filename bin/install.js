#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const projectRoot = process.cwd();
const harnessDir = join(projectRoot, "ml-harness");
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const selfPackageJson = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf-8"));
const command = process.argv[2] ?? "help";

function usage() {
  console.log(`ml-harness ${selfPackageJson.version}

Usage:
  npx ml-harness init     Install the harness into ./ml-harness and register it with project-local Pi settings.
  npx ml-harness update   Refresh the contained harness install without touching project artifacts.
  npx ml-harness doctor   Print the current project harness status.

Install/update only touch ./ml-harness, ./.pi/settings.json, ./.pi/subagents.json when missing, and optional ZentUI user config when missing.
Project files such as ./.ml-harness, ./docs, ./src, ./tests, reports, truths, and drafts are never overwritten by this CLI.`);
}

function toFileSpec(path) {
  return `file:${path.replace(/\\/g, "/")}`;
}

function npmCliPath() {
  const localCli = join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  if (existsSync(localCli)) {
    return localCli;
  }

  throw new Error("Could not find npm-cli.js next to the active Node executable.");
}

function runNodeScript(script, args, options = {}) {
  return spawnSync(process.execPath, [script, ...args], {
    stdio: "inherit",
    ...options,
  });
}

function isInstalledPackageRoot() {
  return /[\\/]node_modules[\\/]/.test(packageRoot);
}

function packageSpec() {
  if (process.env.ML_HARNESS_SPEC) {
    return process.env.ML_HARNESS_SPEC;
  }

  if (process.env.NOSH_PI_MLHARNESS_SPEC) {
    return process.env.NOSH_PI_MLHARNESS_SPEC;
  }

  if (!isInstalledPackageRoot()) {
    return toFileSpec(packageRoot);
  }

  return command === "update"
    ? `${selfPackageJson.name}@latest`
    : `${selfPackageJson.name}@${selfPackageJson.version}`;
}

function packageInstallPath(packageName) {
  const parts = packageName.startsWith("@")
    ? packageName.split("/")
    : [packageName];

  return join(harnessDir, "node_modules", ...parts);
}

function expandHome(path) {
  if (!path?.startsWith("~")) {
    return path;
  }

  return join(homedir(), path.slice(1));
}

function agentDir() {
  return expandHome(process.env.PI_CODING_AGENT_DIR ?? join(homedir(), ".pi", "agent"));
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

function writeHarnessPackageJson() {
  const target = join(harnessDir, "package.json");
  const harnessPackageJson = existsSync(target)
    ? readJson(target)
    : {
        name: "ml-harness-runtime",
        version: "0.1.0",
        private: true,
        type: "commonjs",
      };

  harnessPackageJson.name = harnessPackageJson.name === selfPackageJson.name
    ? "ml-harness-runtime"
    : (harnessPackageJson.name ?? "ml-harness-runtime");
  harnessPackageJson.private = true;

  const dependencies = harnessPackageJson.dependencies ?? {};
  delete dependencies["@gotgenes/pi-subagents"];
  delete dependencies["@nosh/pi-subagents"];
  delete dependencies["@nosh/pi-mlharness"];
  harnessPackageJson.dependencies = dependencies;

  writeFileSync(target, JSON.stringify(harnessPackageJson, null, 2) + "\n");
}

function writePiSettings() {
  const piDir = join(projectRoot, ".pi");
  mkdirSync(piDir, { recursive: true });

  const settingsPath = join(piDir, "settings.json");
  const packagePath = packageInstallPath(selfPackageJson.name);
  const relativePackagePath = `..\\${relative(projectRoot, packagePath).replace(/\//g, "\\")}`;

  let settings = {};
  if (existsSync(settingsPath)) {
    settings = readJson(settingsPath);
  }

  const packages = Array.isArray(settings.packages) ? settings.packages : [];
  const stalePackages = new Set([
    "..\\ml-harness\\node_modules\\@nosh\\pi-mlharness",
    "../ml-harness/node_modules/@nosh/pi-mlharness",
  ]);

  settings.packages = [
    ...packages.filter((entry) => !stalePackages.has(entry)),
    ...(packages.includes(relativePackagePath) ? [] : [relativePackagePath]),
  ];

  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
}

function writeSubagentSettings() {
  const piDir = join(projectRoot, ".pi");
  mkdirSync(piDir, { recursive: true });

  const target = join(piDir, "subagents.json");
  if (existsSync(target)) {
    return;
  }

  writeFileSync(
    target,
    JSON.stringify(
      {
        maxConcurrent: 4,
        defaultMaxTurns: 0,
        graceTurns: 5,
      },
      null,
      2,
    ) + "\n",
  );
}

function writeZentuiSettings() {
  const dir = agentDir();
  mkdirSync(dir, { recursive: true });

  const target = join(dir, "zentui.json");
  if (existsSync(target)) {
    return;
  }

  writeFileSync(
    target,
    JSON.stringify(
      {
        features: {
          editor: true,
          statusLine: true,
          copyFriendly: false,
        },
      },
      null,
      2,
    ) + "\n",
  );
}

function removeInstalledPackageCopies() {
  const packageDirs = [
    packageInstallPath(selfPackageJson.name),
    resolve(harnessDir, "node_modules", "@nosh", "pi-mlharness"),
  ];

  for (const packageDir of packageDirs) {
    if (!existsSync(packageDir)) {
      continue;
    }

    if (resolve(packageRoot) === packageDir) {
      continue;
    }

    rmSync(packageDir, { recursive: true, force: true });
  }
}

function removeLegacySubagentsCopy() {
  for (const packageDir of [
    resolve(harnessDir, "node_modules", "@gotgenes", "pi-subagents"),
    resolve(harnessDir, "node_modules", "@nosh", "pi-subagents"),
  ]) {
    if (existsSync(packageDir)) {
      rmSync(packageDir, { recursive: true, force: true });
    }
  }
}

function installHarness() {
  mkdirSync(harnessDir, { recursive: true });
  writeFileSync(join(harnessDir, ".npmrc"), "install-links=true\n");
  writeHarnessPackageJson();
  removeInstalledPackageCopies();
  removeLegacySubagentsCopy();

  let install;
  try {
    install = runNodeScript(
      npmCliPath(),
      ["install", "--prefix", harnessDir, "--install-links=true", "--omit=peer", "--force", packageSpec()],
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  if (install.error) {
    console.error(`Failed to run npm: ${install.error.message}`);
    process.exit(1);
  }

  if (install.status !== 0) {
    process.exit(install.status ?? 1);
  }

  writePiSettings();
  writeSubagentSettings();
  writeZentuiSettings();
  console.log(`\nInstalled ML Harness in ${harnessDir}`);
}

function doctor() {
  const packagePath = packageInstallPath(selfPackageJson.name);
  const settingsPath = join(projectRoot, ".pi", "settings.json");
  const subagentSettingsPath = join(projectRoot, ".pi", "subagents.json");
  const harnessPackagePath = join(harnessDir, "package.json");
  const installedPackageJsonPath = join(packagePath, "package.json");

  console.log(`ML Harness doctor

project: ${projectRoot}
harness dir: ${harnessDir}
expected package path: ${packagePath}
`);

  console.log(`harness package.json: ${existsSync(harnessPackagePath) ? "present" : "missing"}`);
  console.log(`installed package: ${existsSync(installedPackageJsonPath) ? "present" : "missing"}`);

  if (existsSync(installedPackageJsonPath)) {
    const installed = readJson(installedPackageJsonPath);
    console.log(`installed version: ${installed.name}@${installed.version}`);
  }

  if (existsSync(settingsPath)) {
    const settings = readJson(settingsPath);
    const packages = Array.isArray(settings.packages) ? settings.packages : [];
    console.log(`.pi/settings.json packages: ${packages.length ? packages.join(", ") : "none"}`);
  } else {
    console.log(".pi/settings.json: missing");
  }

  console.log(`.pi/subagents.json: ${existsSync(subagentSettingsPath) ? "present" : "missing"}`);
  console.log(`zentui config: ${existsSync(join(agentDir(), "zentui.json")) ? "present" : "missing"}`);
}

switch (command) {
  case "init":
  case "install":
  case "update":
    installHarness();
    break;
  case "doctor":
    doctor();
    break;
  case "help":
  case "--help":
  case "-h":
    usage();
    break;
  default:
    console.error(`Unknown command: ${command}\n`);
    usage();
    process.exit(1);
}
