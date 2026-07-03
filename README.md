# ml-harness

`ml-harness` is a custom Pi package for running Nosh's ML research/product orchestration harness inside a project.

It assumes the user already has [Pi](https://pi.dev/) installed. This package does not install Pi, replace Pi, or own the user's project code. It installs a contained harness runtime into the current project and registers that runtime with project-local Pi settings.

## What This Repo Is

This repository contains the publishable npm package `ml-harness`.

The package provides:

- A Pi extension entrypoint at `src/index.ts`.
- Nosh, the main-chat orchestrator prompt and runtime context.
- A bundled specialist subagent roster under `agents/`.
- Private chain definitions under `chains/` that only Nosh should inspect.
- Slash command prompts under `prompts/`.
- Deterministic onboarding/artifact setup scripts under `scripts/`.
- Report/artifact templates under `templates/`.
- A vendored Nosh fork of `pi-subagents` under `vendor/pi-subagents/`.
- Bundled Pi packages for web access, todos, and ZentUI.

This repo intentionally does not contain any specific project artifacts, experiment outputs, paper drafts, or user project files.

## What The Package Does

When loaded by Pi, `ml-harness` turns the main chat into a Nosh-led orchestration environment.

Nosh owns the broad project context and delegates narrow work to specialist subagents. Subagents do not inherit the full main-chat context. Nosh must pass exact files, reports, and artifacts in each delegation packet.

The harness is designed around two canonical control surfaces:

- `.ml-harness/truths/phase-breakdown.md` is the authoritative phase/part plan.
- The bundled `todo` tool is the live operational next-task queue.

After every subagent result, Nosh is instructed to reconcile reports, project artifacts, and the live todo queue before continuing.

## Install Model

Run commands from the root of the project where you want to use Pi with the harness.

```bash
npx ml-harness init
```

This creates or updates only harness-owned install state:

- `./ml-harness/package.json`
- `./ml-harness/package-lock.json`
- `./ml-harness/node_modules/`
- `./.pi/settings.json`
- `./.pi/subagents.json` if missing
- `~/.pi/agent/zentui.json` if missing

It does not create or overwrite project artifacts. Project artifacts are created later from inside Pi by running `/onboard`.

To update a stale harness install:

```bash
npx ml-harness update
```

`update` refreshes the contained harness package in `./ml-harness` and preserves existing project files.

To inspect the project wiring:

```bash
npx ml-harness doctor
```

`doctor` prints the expected installed package path, installed version, Pi package registration, subagent settings status, and ZentUI config status.

## What It Does Not Touch

The CLI does not overwrite:

- `./.ml-harness/`
- `./docs/`
- `./src/`
- `./tests/`
- experiment outputs
- reports
- truth files
- paper drafts
- user code

The npm package itself is inert when merely downloaded as a dependency. Project setup happens through `npx ml-harness init` or `npx ml-harness update`.

## Pi Slash Commands

After `init`, start Pi from the project root. The harness contributes these slash commands:

- `/help` - explains the harness before onboarding; after onboarding, asks Nosh to summarize current project state.
- `/doctor` - shows the loaded roster, source precedence, roles, capabilities, and active harness tools.
- `/onboard` - creates deterministic project artifacts and starts Nosh's project interview.
- `/todos` - shows the live next-task queue from the bundled todo package.

## Project Artifacts

`/onboard` initializes the project artifact structure under `.ml-harness/`.

Important files include:

- `.ml-harness/truths/project-context.md`
- `.ml-harness/truths/grill-session.md`
- `.ml-harness/truths/user-answers.md`
- `.ml-harness/truths/decisions.md`
- `.ml-harness/truths/phase-breakdown.md`
- `.ml-harness/truths/paper-definition.md`
- `.ml-harness/truths/claim-ledger.md`
- `.ml-harness/reports/{part-id}.md`
- `.ml-harness/state.json`
- `.ml-harness/timeline.md`
- `docs/paper-draft.md`

During onboarding, raw user answers are appended verbatim to `user-answers.md` after each answer. `phase-breakdown.md` becomes the source of truth for bounded tasks. `paper-definition.md`, `claim-ledger.md`, and `docs/paper-draft.md` keep paper-targeted projects from drifting into endless implementation work without a publishable manuscript.

## Orchestration Model

Nosh is not a subagent. Nosh lives in the main chat and receives the full harness context.

Specialist subagents are scoped workers. They get:

- an exact objective,
- exact input files,
- expected output files,
- success criteria,
- report action,
- no inherited main-chat context.

The default loop is:

1. Nosh selects a bounded part from `phase-breakdown.md`.
2. Nosh delegates to the correct specialist or parallel specialists.
3. Specialists write artifacts and `.ml-harness/reports/{part-id}.md`.
4. Review agents inspect important outputs.
5. Nosh reconciles reports, truth files, draft, claim ledger, timeline, and live todos.
6. Nosh either delegates the next part, repairs the phase plan, synthesizes evidence, or states a concrete external blocker.

For paper-targeted AI Lab work, the mission is not complete just because experiments ran or draft sections exist. The paper contract requires supported claims, completed sections, final exit proofs, and adversarial review.

## Bundled Capabilities

The package bundles and bootstraps:

- `@juicesharp/rpiv-todo` for the live main-chat todo queue.
- `pi-web-access` for `web_search`, `fetch_content`, and `get_search_content`.
- `pi-zentui` for the ZentUI Pi theme integration.
- `vendor/pi-subagents` as the harness-owned subagent runtime fork.

Research agents are instructed to prefer:

- arXiv
- Semantic Scholar
- OpenAlex
- Hugging Face
- Crossref
- GitHub
- official docs
- benchmark reports
- implementation blogs

## Repo Layout

- `agents/` - specialist subagent shims plus Nosh's source prompt.
- `chains/` - private bounded workflows for Nosh.
- `prompts/` - slash command prompt templates.
- `skills/` - Pi skills exposed by the package.
- `templates/` - report templates and schemas.
- `assets/` - packaged phase defaults.
- `scripts/` - deterministic helper scripts.
- `src/` - Pi extension glue and harness runtime tools.
- `vendor/pi-subagents/` - bundled subagent runtime fork.
- `bin/install.js` - public `ml-harness` CLI.

## Development And Publishing

Check package contents:

```bash
npm pack --dry-run
```

Create a tarball:

```bash
npm pack
```

Test the CLI from the tarball:

```bash
npm exec --yes --package ./ml-harness-0.1.0.tgz -- ml-harness --help
```

Publish:

```bash
npm publish --access public
```

Do not publish a separate Nosh subagents package. The vendored runtime is part of `ml-harness`.
