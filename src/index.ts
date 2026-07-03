import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { defineTool, parseFrontmatter, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { loadCustomAgents } from "../vendor/pi-subagents/src/config/custom-agents.ts";
import { getSubagentsService } from "../vendor/pi-subagents/src/service/service.ts";
import subagentsExtension from "../vendor/pi-subagents/src/index.ts";
import todoExtension from "@juicesharp/rpiv-todo/index.ts";
import webAccessExtension from "pi-web-access/index.ts";
import zentuiExtension from "pi-zentui/extensions/zentui/index.ts";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const agentsDir = join(packageRoot, "agents");
const chainsDir = join(packageRoot, "chains");
const scriptsDir = join(packageRoot, "scripts");
const noshPath = join(agentsDir, "nosh.md");
const webAccessRoot = dirname(require.resolve("pi-web-access/package.json"));
const webAccessSkillsDir = join(webAccessRoot, "skills");

type ChainDefinition = {
  name: string;
  description: string;
  relativePath: string;
  body: string;
};

type AgentRosterEntry = {
  name: string;
  description: string;
  tools: string[];
  thinking: string | null;
  maxTurns: number | null;
  capabilities: string[];
  source: string;
  promptMode: string;
  inheritContext: boolean | null;
};

const EMPTY_PARAMS = Type.Object({});
const TRUTH_FILES = [
  ".ml-harness/truths/project-context.md",
  ".ml-harness/truths/grill-session.md",
  ".ml-harness/truths/user-answers.md",
  ".ml-harness/truths/decisions.md",
  ".ml-harness/truths/phase-breakdown.md",
  ".ml-harness/truths/paper-definition.md",
  ".ml-harness/truths/claim-ledger.md",
  ".ml-harness/state.json",
];
const NOSH_ONLY_TOOLS = [
  "todo",
  "harness_project_status",
  "harness_init_artifacts",
  "harness_runtime_status",
];
const KNOWN_HARNESS_TOOL_NAMES = [
  "subagent",
  "get_subagent_result",
  "steer_subagent",
  "todo",
  "harness_project_status",
  "harness_init_artifacts",
  "harness_runtime_status",
  "web_search",
  "fetch_content",
  "get_search_content",
];

function collectMarkdownFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function loadChains(): ChainDefinition[] {
  return collectMarkdownFiles(chainsDir)
    .map((filePath) => {
      const raw = readFileSync(filePath, "utf-8");
      const { frontmatter, body } = parseFrontmatter<Record<string, string>>(raw);
      const relativePath = relative(chainsDir, filePath).replace(/\\/g, "/");
      const fallbackName = basename(filePath, ".md");

      return {
        name: frontmatter.name ?? fallbackName,
        description: frontmatter.description ?? "",
        relativePath,
        body: body.trim(),
      };
    })
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

function loadNoshInstructions(): string {
  const raw = readFileSync(noshPath, "utf-8");
  const { body } = parseFrontmatter<Record<string, string>>(raw);
  return body.trim();
}

function renderChainLibrary(chains: ChainDefinition[]): string {
  return chains
    .map((chain) =>
      [
        `## ${chain.name}`,
        `Path: chains/${chain.relativePath}`,
        chain.description ? `Description: ${chain.description}` : "",
        "",
        chain.body,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n---\n\n");
}

function extractCapabilityLines(body: string): string[] {
  const match = body.match(/## Capabilities\s+([\s\S]*?)(?:\n## |\s*$)/);
  if (!match) {
    return [];
  }

  return match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\|\s*`[^`]+`\s*\|/.test(line))
    .map((line) => {
      const cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean);
      if (cells.length < 2) {
        return "";
      }

      const code = cells[0].replace(/`/g, "");
      const description = cells[1];
      return `${code}: ${description}`;
    })
    .filter(Boolean);
}

function loadAgentRoster(): AgentRosterEntry[] {
  return [...loadCustomAgents(process.cwd(), [agentsDir]).values()]
    .filter((agent) => agent.enabled !== false && agent.name !== "nosh")
    .map((agent) => ({
      name: agent.name,
      description: agent.description,
      tools: agent.builtinToolNames ?? ["read", "bash", "edit", "write", "grep", "find", "ls"],
      thinking: agent.thinking ?? null,
      maxTurns: agent.maxTurns ?? null,
      capabilities: extractCapabilityLines(agent.systemPrompt),
      source: agent.source ?? "package",
      promptMode: agent.promptMode,
      inheritContext: agent.inheritContext ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function runtimeStatus(pi: ExtensionAPI) {
  const roster = loadAgentRoster();
  const activeTools = pi.getActiveTools().slice().sort();
  const harnessTools = activeTools.filter((toolName) => KNOWN_HARNESS_TOOL_NAMES.includes(toolName));

  return {
    cwd: process.cwd(),
    projectStatus: projectStatus(process.cwd()),
    sourcePrecedence: [
      "project",
      "global",
      "package",
    ],
    harnessTools,
    activeTools,
    roster,
  };
}

function isSubagentTurn(systemPrompt: string): boolean {
  return systemPrompt.includes("<active_agent name=");
}

function projectStatus(cwd: string) {
  const truthFiles = TRUTH_FILES.map((path) => ({
    path,
    exists: existsSync(join(cwd, path)),
  }));
  const existingTruthFiles = truthFiles.filter((file) => file.exists).map((file) => file.path);

  return {
    fresh: existingTruthFiles.length === 0,
    truthFiles,
    existingTruthFiles,
    truthDir: ".ml-harness/truths",
  };
}

function runArtifactScript(cwd: string) {
  const scriptPath = join(scriptsDir, "init_project_artifacts.py");
  const candidates = [
    process.env.PYTHON,
    "python",
    "py",
  ].filter((candidate): candidate is string => Boolean(candidate));

  for (const command of candidates) {
    const result = spawnSync(command, [scriptPath, cwd], {
      cwd,
      encoding: "utf-8",
    });

    if (!result.error || result.error.code !== "ENOENT") {
      return {
        command,
        status: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
        error: result.error?.message,
      };
    }
  }

  return {
    command: "",
    status: 1,
    stdout: "",
    stderr: "Could not find Python. Tried PYTHON, python, and py.",
  };
}

export default function (pi: ExtensionAPI) {
  // The harness owns subagent bootstrap so one package is enough for local use.
  subagentsExtension(pi);
  todoExtension(pi);
  webAccessExtension(pi);
  zentuiExtension(pi);

  const subagents = getSubagentsService();
  if (!subagents) {
    throw new Error("Failed to initialize the vendored pi-subagents runtime for ml-harness.");
  }

  const unregisterAgents = subagents.registerAgentDirectory(agentsDir);

  pi.registerTool(
    defineTool({
      name: "harness_project_status",
      label: "Harness Project Status",
      description: "Check whether Nosh ML harness truth files exist for this project.",
      promptSnippet: "Check whether this is a fresh Nosh ML harness project or an initialized one.",
      promptGuidelines: [
        "Use before answering /help.",
        "If truth files exist, read them before summarizing project status.",
      ],
      parameters: EMPTY_PARAMS,
      async execute(_toolCallId, _params) {
        const status = projectStatus(process.cwd());
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(status, null, 2),
            },
          ],
          details: status,
        };
      },
    }),
  );

  pi.registerTool(
    defineTool({
      name: "harness_init_artifacts",
      label: "Initialize Harness Artifacts",
      description: "Create Nosh ML harness project artifacts with the bundled Python script.",
      promptSnippet: "Initialize Nosh ML harness project artifacts deterministically.",
      promptGuidelines: [
        "Use at the start of /onboard before asking the user about the project.",
        "Do not hand-write the scaffolded artifacts when this tool is available.",
      ],
      parameters: EMPTY_PARAMS,
      async execute(_toolCallId, _params) {
        const result = runArtifactScript(process.cwd());
        const status = projectStatus(process.cwd());
        const isError = result.status !== 0;
        return {
          content: [
            {
              type: "text" as const,
              text: [
                result.stdout.trim(),
                result.stderr.trim() ? `stderr:\n${result.stderr.trim()}` : "",
              ].filter(Boolean).join("\n\n"),
            },
          ],
          details: {
            ...result,
            projectStatus: status,
          },
          isError,
        };
      },
    }),
  );

  pi.registerTool(
    defineTool({
      name: "harness_runtime_status",
      label: "Harness Runtime Status",
      description: "Inspect the loaded ML harness runtime, roster, and available harness tools.",
      promptSnippet: "Inspect the current ML harness runtime and loaded specialist roster.",
      promptGuidelines: [
        "Use when you need to verify which specialist agents are currently loaded.",
        "Use when you need to verify harness tool availability or agent source precedence.",
      ],
      parameters: EMPTY_PARAMS,
      async execute(_toolCallId, _params, _signal, _onUpdate, ctx) {
        const systemPrompt =
          typeof ctx?.getSystemPrompt === "function" ? ctx.getSystemPrompt() : "";
        if (isSubagentTurn(systemPrompt)) {
          return {
            content: [
              {
                type: "text" as const,
                text: "harness_runtime_status is reserved for the main chat and is unavailable to subagents.",
              },
            ],
            isError: true,
          };
        }

        const status = runtimeStatus(pi);
        const rosterLines = status.roster.map((agent) => {
          const capabilityText = agent.capabilities.length > 0 ? ` | capabilities: ${agent.capabilities.join("; ")}` : "";
          const inheritText = agent.inheritContext === null ? "inherit: default" : `inherit: ${agent.inheritContext}`;
          const thinkingText = agent.thinking ?? "inherit";
          const maxTurnsText = agent.maxTurns === 0 ? "unlimited" : agent.maxTurns === null ? "default" : String(agent.maxTurns);
          const toolsText = agent.tools.length > 0 ? agent.tools.join(", ") : "none";
          return `- ${agent.name} [source: ${agent.source}; prompt: ${agent.promptMode}; ${inheritText}; thinking: ${thinkingText}; max turns: ${maxTurnsText}; tools: ${toolsText}] - ${agent.description}${capabilityText}`;
        });

        return {
          content: [
            {
              type: "text" as const,
              text: [
                `Project root: ${status.cwd}`,
                `Fresh project: ${status.projectStatus.fresh ? "yes" : "no"}`,
                `Source precedence: ${status.sourcePrecedence.join(" > ")}`,
                "",
                "Harness tools:",
                ...status.harnessTools.map((toolName) => `- ${toolName}`),
                "",
                "Loaded specialist roster:",
                ...rosterLines,
              ].join("\n"),
            },
          ],
          details: status,
        };
      },
    }),
  );

  pi.on("resources_discover", () => ({
    skillPaths: [
      ...(existsSync(webAccessSkillsDir) ? [webAccessSkillsDir] : []),
    ],
  }));

  pi.on("before_agent_start", (event) => {
    const subagentTurn = isSubagentTurn(event.systemPrompt);
    const activeTools = pi.getActiveTools();

    if (subagentTurn) {
      if (activeTools.some((toolName) => NOSH_ONLY_TOOLS.includes(toolName))) {
        pi.setActiveTools(activeTools.filter((toolName) => !NOSH_ONLY_TOOLS.includes(toolName)));
      }
      return;
    }

    const missingNoshTools = NOSH_ONLY_TOOLS.filter((toolName) => !activeTools.includes(toolName));
    if (missingNoshTools.length > 0) {
      pi.setActiveTools([...activeTools, ...missingNoshTools]);
    }

    const noshInstructions = loadNoshInstructions();
    const chainLibrary = renderChainLibrary(loadChains());
    const roster = loadAgentRoster()
      .map((agent) => {
        const capabilityText = agent.capabilities.length > 0 ? ` Capabilities: ${agent.capabilities.join("; ")}.` : "";
        const sourceText = ` Source: ${agent.source}.`;
        const thinkingText = agent.thinking ?? "inherit";
        const maxTurnsText = agent.maxTurns === 0 ? "unlimited" : agent.maxTurns === null ? "default" : String(agent.maxTurns);
        const toolsText = agent.tools.length > 0 ? agent.tools.join(", ") : "none";
        return `- ${agent.name}: ${agent.description}${sourceText} Tools: ${toolsText}. Thinking: ${thinkingText}. Max turns: ${maxTurnsText}.${capabilityText}`;
      })
      .join("\n");

    return {
      message: {
        customType: "nosh-orchestrator",
        content: `[NOSH ORCHESTRATOR ACTIVE]
You are active in the main chat as Nosh's orchestrator session.

Runtime facts:
- This session is the top-level main chat, not a spawned subagent.
- Harness-owned tools available here: harness_project_status, harness_init_artifacts, harness_runtime_status.
- The live operational queue is the main-chat-only \`todo\` tool. Use it to keep the active next-task list synchronized with \`.ml-harness/truths/phase-breakdown.md\`.
- The private chain library is injected directly into this main-chat context below. Treat it as Nosh-only orchestration memory.
- Use the roster below as the live source of truth for specialist names, roles, and capability codes.
- When the user names a likely typo such as "jettt" or "kayoo", map it to the closest known roster agent instead of silently treating it as a generic agent.

Known specialist roster:
${roster}

${noshInstructions}

[PRIVATE CHAIN LIBRARY]
${chainLibrary}`,
        display: false,
      },
    };
  });

  pi.on("session_shutdown", () => {
    unregisterAgents();
  });
}
