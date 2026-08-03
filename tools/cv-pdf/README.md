# CV PDF generator

Generates the CV as a tagged, text-selectable A4 PDF from the same facts and the
same design tokens the website renders.

```bash
node tools/cv-pdf/build.mjs --locale en
node tools/cv-pdf/build.mjs --locale cs
node tools/cv-pdf/build.mjs --locale en --variant ../../new_job/cv/variants/acme.json
```

| Flag | Meaning |
| --- | --- |
| `--locale` | `en` or `cs`. Required content comes from `messages/<locale>.json`. |
| `--variant` | Path to a variant overlay. Optional. |
| `--out` | Output path. Defaults to `tools/cv-pdf/out/`. |
| `--html` | Also write the intermediate HTML, for debugging layout. |

## Why it looks the way it does

The point of this tool is that **the CV cannot drift**. Three separate guarantees:

**Facts come from one place.** `data.mjs` bundles `src/content/curriculum-vitae.ts`
with esbuild and imports the result. Company names, dates and chronology are read
from the same module the website renders — there is no second copy to forget.

**Colour comes from one place.** `tokens.mjs` parses
`src/app/(frontend)/styles/variables.css` and extracts the light-mode semantic
tokens. `cv-print.css` defines **no colours at all**; it only references tokens.
Dark-mode blocks are stripped during parsing, because brand guidelines §10.2 says
print uses the light palette and canonical teal — the dark-mode cyan is a
dark-surface expression, not a print colour.

The build **fails** if `--action-primary` stops resolving to `#0a6e80`. A CV that
silently prints in the wrong brand colour is worse than no CV.

**Copy comes from one place.** `render.mjs` writes no user-visible strings. Every
label is read from the message catalogs, so translations stay where translations
live.

## Layout rules

`cv-print.css` owns page geometry and nothing else it does not have to:

- A4 with a 14mm margin, set in `@page` and honoured via `preferCSSPageSize`.
- Spacing uses the token scale (`--space-*`) — no arbitrary values.
- The print type scale is the one deliberate deviation from the web tiers. Web
  tokens are tuned for a 1280px viewport where an H1 of 48px reads correctly; an
  A4 column is ~180mm, so the scale is restated in points at the top of the file.
  Same hierarchy, page-appropriate absolute size.
- A role and its bullets never split across pages (`break-inside: avoid`).

To change how the CV looks, change tokens or that print scale. Do not put values
in the template.

## Variants

A variant is an **overlay, never a copy**. It may reorder and re-emphasise, but
hard facts always come from `curriculum-vitae.ts`.

```json
{
  "slug": "acme",
  "headline": "Frontend React Engineer",
  "summary": "Tailored profile paragraph.",
  "highlights": [{ "title": "Requirement from the ad", "body": "Evidence." }],
  "emphasizeExperience": ["kontentAi", "blueghost"],
  "hideExperience": ["bitware"]
}
```

`emphasizeExperience` floats those roles to the top; everything else keeps
chronological order. `hideExperience` drops entries — useful for length, not for
hiding anything awkward.

The build **refuses** a variant that sets `experience`, `education`, `person` or
`contact`. Those are facts, and facts are edited in `curriculum-vitae.ts` where
the website sees them too.

Variants for specific companies live outside this repo, in `new_job/cv/variants/`.

## Fonts

Inter is vendored in `fonts/` so the build is reproducible and works offline.
Inter v20 is a variable font, so one file per subset covers every weight. The
woff2 files are inlined as data URIs, making the generated HTML self-contained.

`latin-ext` is required for Czech diacritics and is not optional.

Refresh with `node tools/cv-pdf/fetch-fonts.mjs` — only when Inter itself needs
updating.

## Output

`tools/cv-pdf/out/` is gitignored. Generated PDFs are build artefacts; the public
downloads under `public/curriculum-vitae/` are updated deliberately, not on every
run.
