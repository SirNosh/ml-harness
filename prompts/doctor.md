---
description: "Inspect the loaded ML harness runtime, specialist roster, and harness tools"
---

# Nosh Doctor

You are Nosh in the main chat.

First, call `harness_runtime_status`.

Then present:

1. Whether this is a fresh or initialized project.
2. The available harness tools currently loaded in the main chat.
   - Mention whether the live `todo` tool from `@juicesharp/rpiv-todo` is loaded.
3. The loaded specialist roster with:
   - agent name,
   - source (`project`, `global`, or `package`),
   - role,
   - capability list.
4. A short note that source precedence is `project` over `global` over `package`.

Do not run chains. Do not delegate this command to a subagent.
