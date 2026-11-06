# CV PDF generator

Generates the CV as a tagged, text-selectable A4 PDF from the same facts and the
same design tokens the website renders.

```bash
node tools/cv-pdf/build.mjs --locale en
node tools/cv-pdf/build.mjs --locale cs
node tools/cv-pdf/build.mjs --locale en --variant ../new_job/cv/variants/acme.en.json
node tools/cv-pdf/build-letter.mjs --locale en --letter ../new_job/cv/letters/acme.en.json
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

A variant is an **overlay, never a copy**. It may reorder, re-emphasise and
rewrite prose, but hard facts always come from `curriculum-vitae.ts`.

```json
{
  "slug": "acme",
  "locale": "en",
  "headline": "Technical Analyst",
  "taglineKeywords": ["Requirements analysis", "API design"],
  "summary": ["Tailored paragraph one.", "Tailored paragraph two."],
  "highlightsTitle": "Target-fit highlights",
  "highlights": [{ "title": "Requirement from the ad", "body": "Evidence." }],
  "skills": [
    { "id": "analysis", "title": "Analysis and design", "description": "New row." },
    { "id": "frontendEngineering", "title": "Frontend" },
    "qualityAndTooling"
  ],
  "experienceCopy": {
    "nkp": { "bullets": ["Rewritten bullet.", "Another one."] }
  },
  "earlierExperienceCopy": { "austroBohemia": { "summary": "Rewritten footnote." } },
  "emphasizeExperience": ["kontentAi", "blueghost"],
  "hideExperience": ["bitware"]
}
```

| Key | Effect |
| --- | --- |
| `locale` | Optional. The build refuses to render the variant under the other locale. |
| `headline`, `taglineKeywords` | Masthead line: role, then keywords separated by bars. |
| `summary` | Replaces the professional summary. A string or an array of paragraphs. |
| `highlights`, `highlightsTitle` | Optional target-fit section between summary and skills. |
| `skills` | Replaces the skills table. Each row is a catalog id (reuse its copy), an object with an `id` plus overriding `title`/`description`, or a new row with both. |
| `emphasizeSkills` | Without `skills`: floats those catalog rows to the top. |
| `experienceCopy` | Per role id, `summary` and/or `bullets`. The head line (title, company, period) and the stack are facts and cannot be set here. |
| `earlierExperienceCopy` | Per earlier-experience id, `summary` only. |
| `emphasizeExperience` | Floats those roles to the top; everything else keeps chronological order. |
| `hideExperience` | Drops entries — useful for length, not for hiding anything awkward. |

Prose is still a claim about facts. A rewritten bullet may change emphasis and
wording; it may not describe work that did not happen.

The build **refuses** a variant that sets `experience`, `education`, `person`,
`contact` or `languages`, an unknown key, or a role overlay that touches
anything but `summary` and `bullets`. Facts are edited in `curriculum-vitae.ts`
where the website sees them too. `src/__tests__/unit/cv-pdf-variant.test.ts`
holds this contract.

Variants for specific companies live outside this repo, in `new_job/cv/variants/`,
one file per locale (`<slug>.<locale>.json`).

## Cover letters

`build-letter.mjs` renders a cover letter with the CV's masthead, tokens and
type scale, so the two documents in an application cannot disagree on identity.

```json
{
  "slug": "acme",
  "locale": "en",
  "headline": "Technical Analyst",
  "date": "2026-11-06",
  "recipient": ["Acme Corp.", "Hiring team", "Street 1", "110 00 Prague"],
  "subject": "Application: Technical Analyst",
  "salutation": "Dear hiring team,",
  "paragraphs": ["...", "..."],
  "closing": "Kind regards,",
  "enclosuresLabel": "Enclosure:",
  "enclosures": ["Curriculum vitae (CV_Karel_Kutchan.pdf)"]
}
```

Name, contact line and footer come from the shared facts; `headline` should
match the variant's. `letter-print.css` adds the letter blocks on top of
`cv-print.css` under the same rules (no colours, token spacing). Letter sources
live in `new_job/cv/letters/`.

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

A company-specific application can be published under its own folder with
`--out public/<slug>/...`. Anything under `public/` is served once deployed, so
such a folder is a deliberate choice, and the stable paths in
`docs/decisions/curriculum-vitae.md` (CV-03) are never repointed at a variant.
