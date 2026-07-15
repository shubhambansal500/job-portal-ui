---
name: pr-review
description: Review a PR (local branch diff or GitHub PR by number) against this job-portal-ui repo's own conventions from CLAUDE.md — branch naming, Conventional Commits, no TypeScript, Tailwind-only styling, services/delay() data layer, naming rules, and PR description format. Complements the generic /code-review and /review skills, which don't know this repo's specific rules. Use when the user asks to "review this PR", "check this PR against our conventions", or "run pr-review".
---

# PR review (repo conventions)

Checks a PR or branch diff against the project-specific rules in root `CLAUDE.md`. This is **not** a substitute for `/code-review` (correctness/bugs) or `/review` (general GitHub PR review) — run this alongside them, focused purely on repo-convention compliance.

## Steps

1. **Determine the target**:
   - If given a PR number, use `gh pr view <number>` and `gh pr diff <number>`.
   - Otherwise, diff the current branch against `main`: `git log main..HEAD` and `git diff main...HEAD`.

2. **Branch naming** (skip if reviewing a PR number where the branch already merged/closed):
   - Must match one of: `feature/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`, `style/*`.

3. **Commit messages** — for every commit in the diff range:
   - Follows Conventional Commits: `type: subject` (`feat`, `fix`, `docs`, `chore`, `refactor`, `style`).
   - Present tense, lowercase after the colon, no trailing period.
   - Subject line under 72 characters.
   - Non-obvious changes have a body explaining why.

4. **File/type checks**:
   - No `.ts` / `.tsx` files added.
   - No class components — functional components only.
   - New components use named exports (unless matching an existing default-export convention already established in that directory — e.g. `src/pages/` currently uses `export default`, see [[add-page]] notes).

5. **Styling checks**:
   - Tailwind utility classes only — no inline `style={}`, no CSS modules.
   - No Tailwind `dark:` variants — dark mode must go through `ThemeContext` conditional classes.
   - Mobile-first breakpoints (`sm:`, `md:`, `lg:`) where responsive behavior is needed.

6. **State & data checks**:
   - Page components don't fetch data directly — they call functions in `src/services/`.
   - Async service functions use `delay()` from `src/utils/delay.js`.
   - User-specific persisted data follows the `{entity}_{userId}` localStorage key pattern.
   - No new external state library introduced — shared state goes through React Context (`src/context/` or `src/contexts/`).

7. **Naming checks**:
   - Components: `PascalCase`, file name matches the default/named export.
   - Variables/functions: `camelCase`. Constants: `UPPER_SNAKE_CASE`.

8. **Lint**: confirm `npm run lint` passes on the branch (run it if not already known to pass).

9. **PR description** (only when reviewing an actual GitHub PR via `gh`):
   - Title matches the commit message format.
   - Body includes a summary and a test plan.
   - Base branch is `main`.

## Output

Report findings grouped by category (branch/commits, file/type, styling, state/data, naming, lint, PR description). For each violation, cite the file/line or commit. If everything passes, say so briefly — don't pad the report with things that are already correct.
