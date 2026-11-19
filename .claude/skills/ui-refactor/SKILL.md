---
name: ui-refactor
description: Review and refactor UI components for better design, accessibility, and consistency. Loads ux-designer skill knowledge to evaluate and improve existing interfaces.
user_invocable: true
---

# /ui-refactor - UI Refactoring Command

Review and improve existing UI components based on modern UX best practices.

Follow the 7 steps below in order.

## Step 1: Determine Scope

- If the user specified a component or page, use that as the scope.
- Otherwise, ask the user which area to refactor:
  - A specific component (e.g., "dashboard", "meal-form")
  - A specific page (e.g., "/", "/settings")
  - All components (full audit)

## Step 2: Load Context

Read these files before auditing:

- `.claude/skills/ux-designer/SKILL.md` — design knowledge (ux-designer skill)
- `src/index.css` — current color tokens and theme
- `CLAUDE.md` — coding conventions (shadcn/ui rules, animation rules, etc.)

## Step 3: Audit

Evaluate each component in scope against all five criteria groups:

### Visual Design
- Color contrast meets WCAG 2.2 AA: 4.5:1 for text, 3:1 for large text/UI
- Spacing is consistent: uses the Tailwind spacing scale, no magic numbers
- Typography hierarchy: clear heading levels; body text readable at >= 16px
- Dark/light mode parity: both themes look intentional, not broken

### Interaction Design
- Touch targets >= 44px on mobile
- Hover/focus/active states present
- Loading and error states handled
- Transitions are smooth (200-500ms)

### Accessibility
- Semantic HTML elements used
- ARIA labels where needed
- Keyboard navigable
- Screen reader friendly

### Consistency
- Follows shadcn/ui patterns (no direct edits to `src/components/ui/`)
- Uses the project's CSS variables, not hardcoded colors
- Animation style matches existing motion patterns
- Form components use the react-hook-form + zod pattern

### Mobile-First
- Responsive layout works at 320px and up
- No horizontal overflow
- Text sizes appropriate for mobile

## Step 4: Report

Present findings in Japanese, using this structure:

```
## UI リファクタリングレポート: [Component/Page]

### 問題点
| # | 重要度 | 箇所 | 問題 | 改善案 |
|---|--------|------|------|--------|
| 1 | 高/中/低 | file:line | ... | ... |

### 推奨変更 (優先順)
1. [高] ...
2. [中] ...
3. [低] ...

### 推定コスト: [S/M/L/XL]
```

## Step 5: Ask for Approval

Ask the user, exactly:

**"この改善を実行してよろしいですか？全て / 一部を選択 / キャンセル"**

Do not proceed to Step 6 without approval.

## Step 6: Execute (after approval)

DO:
- Apply the approved changes.
- Run `bunx biome check --write` after modifications.
- Verify the build succeeds: `bun run build`.
- Report what was changed.

DON'T:
- Edit files under `src/components/ui/`. Override styles via `className` on the consumer side instead.

## Step 7: Verify Visually with Playwright

After the build succeeds, confirm the result visually before reporting the task as complete:

1. Start the dev server if it is not already running: `bun run dev`.
2. Use Playwright to navigate to the affected page and capture screenshots at both viewports:
   - Mobile: 375px
   - Desktop: >= 1280px
3. Check that:
   - The golden path still renders correctly
   - There are no layout breaks, overflow, or regressions
   - Interactive states (hover, focus, active, open drawer/sheet) look as intended
4. Attach or reference the screenshots in the final report.
5. If a screenshot reveals a regression, fix it before declaring the task complete.
