# Nepal's Data

A data storytelling portal on social and political issues in **Nepal and South Asia**: long-form data stories with interactive visualizations, backed by an open CSV data catalog.

This is a **static site**. No build step, no backend, no database. Any static host (GitHub Pages, Netlify, Cloudflare Pages) can serve it.

## Structure

```
index.html                  Homepage
stories/index.html          Story listing
stories/nepal-labor-migration.html   Worked example story
stories/_template.html      Copy-paste starter for new stories
data/index.html             Data catalog (renders from catalog.json)
about.html                  Mission, method, contribute
assets/css/style.css        All styles
assets/js/portal.js         CSV loader, ECharts helpers, catalog renderer
datasets/*.csv              One CSV per dataset, UTF-8, header row
datasets/catalog.json       Catalog metadata (title, description, tags, years, source, file)
```

## Viewing locally

The CSV files load with `fetch`, so pages must be served over HTTP, not opened as `file://`. From the project root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Publishing a new story

1. Copy `stories/_template.html` to `stories/your-slug.html`.
2. Fill in the headline, dek, byline, narrative, and method box. Replace every `TODO`.
3. Put your cleaned CSV in `datasets/`, e.g. `datasets/nepal-election-turnout.csv`. Use a header row, UTF-8, and no merged cells.
4. Add the dataset to `datasets/catalog.json` with title, description, tags, years, source, and filename.
5. Build the chart in the page's `<script>` block using `HimalData.loadCSV` and `HimalData.makeChart` (see the labor migration story for a full example).
6. Add a card for the story in `stories/index.html` and, if it is featured, on the homepage.

## Chart conventions

- Charts use [Apache ECharts](https://echarts.apache.org) (v5) loaded from CDN.
- Palette, in order: crimson `#c8102e`, blue `#0b3d91`, gold `#c98f1b`, green `#2a7f62`, purple `#7a4fa3` (available as `HimalData.palette`).
- Keep y-axes honest: bar charts start at zero. Note any exceptions in the method box.
- Every chart links to its CSV and names its source in `.chart-source`.

## Writing style

- Plain language, short paragraphs, one idea per chart.
- No em dashes. Use commas, colons, or periods.
- Numbers in the text must match the CSV exactly.
- Every story needs a **method and caveats** box and a **sources** list.

## Deploying

- **GitHub Pages:** push this folder to a repo, enable Pages from the branch root.
- **Netlify / Cloudflare Pages:** drag-and-drop this folder, or connect the repo. No build command needed.

## Roadmap ideas

- South Asia press freedom rankings story (RSF data)
- Nepal election turnout story (Election Commission data)
- Kathmandu air quality dashboard (open AQ feeds)
- Search across stories and datasets
- Nepali-language editions of top stories
