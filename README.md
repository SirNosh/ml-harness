# ml-harness

Custom Pi harness for Nosh and reusable ML project workflows.

This package behaves like a real Pi package:

- `src/index.ts` is the single Pi extension entrypoint.
- The extension bootstraps the vendored Nosh fork of `pi-subagents`.
- The extension bootstraps bundled `@juicesharp/rpiv-todo` for a live main-chat todo queue that survives reload and compaction.
- The extension bootstraps `pi-web-access` for research search/fetch tools.
- The extension bootstraps bundled `pi-zentui` so the ZentUI TUI theme behavior comes along with every harness install.
- Nosh lives in the main chat as an injected orchestrator context, not as a spawned subagent.
- Bundled specialist `agents/` are registered with the subagent service.
- Subagents inherit the parent session model by default unless a spawn explicitly overrides it.
- Bundled `chains/` remain private orchestrator resources and are injected directly into Nosh's main-chat context.
- Bundled `skills/` are exposed as Pi skills.

## Layout

- `agents/` - Specialist subagent shims plus the disabled Nosh source prompt.
- `chains/` - Private workflow definitions for Nosh only.
- `prompts/` - Pi slash command prompt templates, including `/help` and `/onboard`.
- `skills/` - Pi skills in `SKILL.md` format.
- `templates/` - Report and artifact templates used by the harness.
- `scripts/` - Deterministic helper scripts used by harness tools.
- `src/index.ts` - Package glue for Pi resource discovery and agent registration.
- `vendor/pi-subagents/` - Bundled Nosh subagent runtime fork; not published separately.

## Slash Commands

- `/help` - Before onboarding, explains the harness and recommends `/onboard`. After truth files exist, asks Nosh to summarize what has been done, what remains, and current project status.
- `/doctor` - Shows the loaded specialist roster, source precedence (`project > global > package`), roles, capabilities, and active harness tools.
- `/onboard` - Runs the bundled Python artifact initializer through `harness_init_artifacts`, then starts Nosh's grilling interview. Chains stay locked until onboarding is complete.
- `/todos` - Shows the live active queue managed by bundled `@juicesharp/rpiv-todo`.

## Truth Files

The harness keeps its truth and report artifacts under `.ml-harness/`:

- `truths/project-context.md`
- `truths/grill-session.md`
- `truths/user-answers.md`
- `truths/decisions.md`
- `truths/phase-breakdown.md`
- `truths/paper-definition.md`
- `truths/claim-ledger.md`
- `reports/{part-id}.md`
- `state.json`

It also creates `docs/paper-draft.md` as the living manuscript for paper-targeted work.

`phase-breakdown.md` is the canonical per-phase work plan. After grilling and before chain work begins, Nosh breaks the project into bounded `part-id` tasks there. Chains are then run against those approved parts one at a time.

The bundled `todo` tool is the live next-task surface in the active branch. `phase-breakdown.md` defines what work is allowed; `todo` carries the current small working set of executable next tasks.

During onboarding, raw user answers are appended verbatim to `truths/user-answers.md` after each response. `docs/paper-draft.md` is created at onboarding time and treated as a living manuscript. For paper-targeted work, Nosh is not done until `truths/paper-definition.md` is satisfied and every draft claim is grounded in `truths/claim-ledger.md`.

## Local Development

`package.json` bundles the Nosh fork inside the harness package:

```json
"files": ["vendor/pi-subagents/"]
```

For a test project, run the installer from the project root:

```bash
npx ml-harness init
```

The installer creates `ml-harness/`, installs the harness inside that folder, and writes project-local Pi settings in `.pi/` that point at `ml-harness/node_modules/ml-harness`.

That is deliberate. Assume Pi is already installed by the user. The installer only lays down harness-owned files and package state inside `ml-harness/`; the subagent runtime is carried inside `ml-harness/vendor/pi-subagents`. It never installs or falls back to the upstream base package. `pi-web-access`, `@juicesharp/rpiv-todo`, and `pi-zentui` are bundled with the harness package.

To refresh a stale project install without touching existing project files:

```bash
npx ml-harness update
```

To inspect the current project wiring:

```bash
npx ml-harness doctor
```

The CLI never overwrites `.ml-harness/`, `docs/`, `src/`, `tests/`, reports, truth files, paper drafts, experiment outputs, or user code. Project artifacts are created by `/onboard` inside Pi, not by npm install or `npx ml-harness init`.

On first install, if `~/.pi/agent/zentui.json` does not already exist, the installer seeds it with ZentUI's editor and status line enabled so fresh setups come up with ZentUI on by default. Existing user-owned ZentUI config is preserved.

## Notes

- The harness owns subagent bootstrap itself. The intended local setup is to load this package, not this package plus a second top-level `pi-subagents` install.
- The harness owns the live todo loop too. `@juicesharp/rpiv-todo` is bundled and bootstrapped from `src/index.ts`, and the `todo` tool is reserved for Nosh in the main chat so subagents cannot silently mutate the operational queue.
- The harness owns `pi-web-access` bootstrap too. Research agents use `web_search`, `fetch_content`, and `get_search_content` with arXiv, Semantic Scholar, OpenAlex, Hugging Face, Crossref, GitHub, docs, benchmark reports, and implementation blogs as preferred sources.
- `pi-zentui` is bundled inside the harness package and bootstrapped from `src/index.ts`, so the published `ml-harness` tarball carries the exact local ZentUI version and loads it without a second top-level package entry.
- Nosh is injected into the top-level session with a hidden orchestration message on each turn.
- The chain library is injected directly into Nosh's main-chat context. Child subagent sessions do not receive chain content and should never be asked to read chain files directly.
- Do not publish a separate Nosh subagents package. Publish `ml-harness`; its tarball includes the vendored runtime.
