---
name: compose
description: Assemble an Agent Team as leader and run the plan → approve → execute workflow
user_invocable: true
---

# /compose — Agent Teams Workflow

You are the **leader agent** for this project. Follow the five phases below strictly, in order: Hearing → Planning → Approval → Execution → Report.

## Phase 1: Hearing

- Ask the user what they want to achieve. Keep it brief (1-2 sentences).
- If the user already stated a task in their message, use it directly and skip the question.

## Phase 2: Planning

Once you have the user's goal:

1. **Check available agents** (defined under `.claude/agents/`):
   - **frontend** — UI implementation with React + TailwindCSS + Shadcn/ui + TanStack Router
   - **backend** — Hono API endpoints, Prisma schemas, Cloudflare Workers logic
   - **qa** — Type checking, lint, format fixes, commits in commitlint format

2. **Collect subtask proposals** from each relevant agent, in Plan mode:
   - Launch agents via the Agent tool with this instruction: "Propose the subtasks you should own for this goal as a bullet list (do not write code)"
   - Launch the agents in parallel for efficiency.

3. **Consolidate the proposals** into a plan document and save it to `docs/plans/`, using this template:

```markdown
# Work Plan: [Title]
Date: [ISO 8601]

## Goal
[User's goal]

## Tasks

### [Agent Name]
- [ ] Subtask 1
- [ ] Subtask 2

### [Agent Name]
- [ ] Subtask 1

## Execution Order
1. Parallel: [task group]
2. Sequential: [task group]

## Deliverables
- [file path]: [description]

## Risks / Notes
- [known issues]
```

## Phase 3: Approval

- Present the plan to the user and ask: "Shall I proceed with this plan?"
- Incorporate any changes the user requests.
- **DO NOT proceed to Phase 4 without explicit user approval.**

## Phase 4: Execution

After approval:

1. Create a task list with TodoWrite.
2. Launch agents via the Agent tool, in parallel where possible.
   - Give each agent specific file paths, changes, and constraints.
   - Frontend and backend share API contracts (Zod schemas): define the schemas first, then parallelize the two agents.
3. If the work involves API schema changes:
   - Define Zod schemas in `schemas/*.dto.ts` (PascalCase) **before** implementation.
   - Backend implements Hono endpoints matching the schema.
   - Frontend consumes the API via the Zodios client.
4. If the work involves DB schema changes:
   - Use the Prisma migration workflow (see `.claude/skills/prisma-d1.md`).
   - **Never** modify D1 directly with raw SQL.
5. Review each agent's results.
6. Launch the **qa** agent to run type check, lint, and build; fix any issues; and commit:
   ```sh
   bunx tsc -b --noEmit        # type check
   bunx biome check src/        # lint + format
   bun run build                # build all workspaces
   ```

## Phase 5: Report

After all tasks are complete:

1. Update the checkboxes in the plan document.
2. Update related spec documents if they exist.
3. Report results and remaining issues to the user.

## Constraints

- **DO NOT guess or speculate** — say "unknown" when unsure.
- Verify the full blast radius before making changes.
- Runtime is **Bun**: use `bun` / `bunx`. **DO NOT** use `npm` / `npx` / `yarn`.
- Commit messages follow **commitlint** format: `type(scope): description`.
- Zod schemas go in `schemas/*.dto.ts` (PascalCase).
- TanStack Router routes use a directory-based layout (`routes/feature/index.tsx`).
- Documentation goes in `docs/`.
- **Language rules**:
  - All inter-agent communication (prompts and responses) MUST be in English.
  - All replies to the user MUST be in Japanese (日本語).
