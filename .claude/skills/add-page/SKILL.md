---
name: add-page
description: Scaffold a new route-level page in this job-portal-ui repo — creates the page component in src/pages/ and registers it in App.jsx with the correct role-based ProtectedRoute wiring. Use when the user asks to add a new page, screen, or route (e.g. "add a page for X", "create a new route at /y", "add an admin page for Z").
---

# Add a new page

Scaffolds a route-level page following this repo's conventions (see root `CLAUDE.md`) and wires it into `src/App.jsx`.

## Steps

1. **Clarify if unclear**: page name, URL path, and access level:
   - Public (no auth)
   - `ROLE_JOB_SEEKER`
   - `ROLE_EMPLOYER`
   - `ROLE_ADMIN`
   Admin pages live in `src/pages/admin/`; everything else lives directly in `src/pages/`.

2. **Create the component** at `src/pages/<PageName>.jsx` (or `src/pages/admin/<PageName>.jsx` for admin pages):
   - Functional component. `CLAUDE.md` states named exports are preferred, but every existing page (`Home`, `Contact`, etc.) actually uses `export default`. Match the existing convention — `const PageName = () => { ... }; export default PageName;` — for consistency with the rest of `src/pages/`.
   - Tailwind utility classes only — no inline styles, no CSS modules. Mobile-first (`sm:`, `md:`, `lg:`).
   - Dark mode via `ThemeContext` conditional classes — do **not** use Tailwind `dark:` variants.
   - If the page needs data, call a function from `src/services/` (which wraps `delay()`) — never fetch or manipulate mock data directly in the page. Add a new service function if one doesn't exist yet.
   - If the page needs user-specific persistence, follow the `{entity}_{userId}` localStorage key pattern used elsewhere (see `AuthContext`/`JobContext`).

3. **Register the route** in `src/App.jsx`:
   - Import the new page at the top with the other page imports.
   - Add a `<Route>` inside the existing `<Route path="/" element={<Layout />}>` block, grouped with the matching section comment (`{/* Job Seeker Routes */}`, `{/* Employer Routes */}`, `{/* Admin Routes */}`, or add a new public route near `Home`/`Jobs`).
   - If the page requires a role, wrap the element in `ProtectedRoute`, matching this exact pattern:
     ```jsx
     <Route
       path="your-path"
       element={
         <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
           <YourPage />
         </ProtectedRoute>
       }
     />
     ```
   - Public pages skip `ProtectedRoute` entirely (see `Home`, `Jobs`, `Contact`).

4. **Verify**:
   - Run `npm run lint`.
   - Start the dev server (`npm run dev`) if not already running, navigate to the new route, and confirm it renders and (if protected) correctly redirects unauthenticated/wrong-role users to `/login` or `/`.

## Notes

- Do not add TypeScript files.
- Do not introduce a new state management approach — use React Context (`src/context/` or `src/contexts/`) if the page needs shared state.
- Keep the page focused; extract reusable pieces into `src/components/`.
