# Refactoring notes

## What changed

1. **Build-time shared HTML:** Seven pages use reusable source fragments for navigation, footer, common head assets, search modal and the standings modal. Published root HTML is still complete and static; no `fetch()` includes, framework, server-side rendering or GitHub Actions are needed.
2. **Removed invalid repeated navigation IDs:** Legacy `id="loginLink"` on multiple navigation elements is no longer emitted. The links and visual styling remain the same.
3. **Reduced data duplication:** The club's 2024/25 and 2025/26 match records reuse the complete fixture archive for dates, teams and scores. Original full-name club scorers are preserved separately; the single historical spelling discrepancy is also preserved.
4. **Shared JavaScript helpers:** Match highlighting and score colors are centralized in `js/matchUtils.js`. Standings rows are centralized in `js/standingsTable.js` and used by all three relevant pages.
5. **Less redundant DOM/CSS work:** Results and tournament match tables now insert their rows in one render pass; unused variables, duplicate CSS declarations, overlapping rule blocks, and a redundant search click listener/DOM append were removed.
6. **No data or asset removal:** All scores, history, standings, tournament information, images (including the `images/unused` directory), PDF files, SEO and tracking references remain included.

## Verification

- Compared the original and refactored exported league and club result data **record by record** — exact equivalence. Added immutable SHA-256 checks for the original league, club results, standings and tournament datasets.
- Executed all seven pages in an isolated headless-browser DOM harness (inlining their local JavaScript because this environment blocks normal HTTP navigation). Compared rendered headings, navigation labels, match rows, season selector behavior, scorer-row toggles, standings modal content, language switching, statistics and search. The original and refactored DOM-test results match for all seven pages, with no JavaScript exceptions.
- Executed `node --check` for each JavaScript module and tested all referenced local assets.

**Testing limitation:** Browser navigation to local HTTP/file URLs was blocked by the execution environment; therefore this is not a claim of full live deployment, CDN availability, visual screenshot or every edge-case interaction. The site still uses its original external Bootstrap, Chart.js, icon font, Google Fonts and GoatCounter resources.

## Deployment

Keep the root HTML generated files in your GitHub Pages publishing branch. For future edits, modify `src/pages/` and `src/partials/`, run `npm run check`, then commit. No changes to the GitHub Pages configuration are necessary.
