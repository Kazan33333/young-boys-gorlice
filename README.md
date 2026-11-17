# Young Boys Gorlice

A static, bilingual club website hosted on **GitHub Pages**. No backend, runtime template fetching, bundler or framework is required to serve it.

## Editing the site

The HTML files in the repository root (`index.html`, `results.html`, etc.) are **generated deployable files**. GitHub Pages serves them directly, so they contain complete HTML and remain usable without JavaScript-based includes.

Edit the source instead:

- `src/pages/*.html` — each page's unique content, SEO metadata and page scripts.
- `src/partials/*.html` — shared header, footer, head dependencies, analytics, search modal and standings modal.
- `js/*.js` — behavior and data, with reusable match and standings helpers.
- `css/*.css` — appearance.

After editing a template, run:

```bash
npm run build
```

Commit the **edited sources and regenerated root HTML files** together. GitHub Pages requires no special workflow and continues to deploy from the root as before. Node.js is needed only for generating pages and running tests; `npm install` is **not** needed.

## Data organization

- `js/leagueFixturesData.js` is the source of truth for **all league fixtures in 2024/25 and 2025/26**, including times, scores and abbreviated/full-league scorer details.
- `js/resultsData.js` holds the original club's historical match records for **2018/19–2023/24**. Its 2024/25–2025/26 results are derived from the club fixtures in `leagueFixturesData.js` to avoid repeating their dates, teams and scores.
- `clubScorers` in `resultsData.js` retains the original **club-only, full-name scorer descriptions**. When a Young Boys game is added to either recent league season, update the scorer entry at the matching position. A runtime validation checks array lengths.
- A historical spelling difference in the 2024/25 result against Przęłęcz Magurska is deliberately retained so the results data and search output remain exactly as before.
- Tournament fixtures, league tables, tournament standings and achievement medals remain in their existing dedicated data files, because they represent different information.

## Checks

```bash
npm test        # test original data, derived matches, HTML and local asset links
npm run check   # regenerate all pages, then run tests
```

All imports and paths are relative, so the JavaScript continues to work from static hosting. The original CNAME, SEO metadata, sitemap, PDF references and media assets are kept intact.

See `REFACTOR_NOTES.md` for a summary of changes and verification.

## License

The source code is licensed under the MIT License. See `LICENSE`. © 2025 Krzysztof Kazanowski. All rights reserved with respect to website content, logo and graphic materials (as in the original project).
