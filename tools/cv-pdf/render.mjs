/**
 * Builds the CV document. Every string comes from the message catalogs or the
 * variant overlay — no copy is written here, so translations stay in one place.
 */

const escapeHtml = (value) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')

function formatPeriod(start, end, locale, presentLabel) {
	const format = (value) => {
		if (!value.includes('-')) return value // year-only, e.g. earlier experience
		const [year, month] = value.split('-').map(Number)
		return new Intl.DateTimeFormat(locale, { month: 'numeric', year: 'numeric' }).format(
			new Date(year, month - 1),
		)
	}
	return `${format(start)} – ${end ? format(end) : presentLabel}`
}

export function renderCv({ facts, messages, variant, locale, tokensCss, fontCss, printCss }) {
	const {
		curriculumVitae: cv,
		curriculumVitaeExperience: experience,
		curriculumVitaeEarlierExperience: earlier,
		curriculumVitaeSkills: skills,
		curriculumVitaeEducation: education,
		curriculumVitaeLanguages: languages,
	} = facts

	const hidden = new Set(variant?.hideExperience?.filter((id) => !id.startsWith('$')) ?? [])
	const emphasised = variant?.emphasizeExperience?.filter((id) => !id.startsWith('$')) ?? []

	// Emphasised roles float to the top; the rest keep chronological order.
	const visible = experience.filter((entry) => !hidden.has(entry.id))
	const ordered = [
		...emphasised.map((id) => visible.find((entry) => entry.id === id)).filter(Boolean),
		...visible.filter((entry) => !emphasised.includes(entry.id)),
	]

	const headline = variant?.headline ?? messages.hero.role
	const summary = variant?.summary ?? messages.hero.intro
	const present = messages.experience.presentLabel

	const contactParts = [
		messages.contact.location,
		cv.contact.phone,
		cv.contact.email,
		'codeguy.cz',
	].filter(Boolean)

	const highlightsSection = variant?.highlights?.length
		? section(
				// Falls back to the catalog rather than reusing the profile
				// eyebrow, which would print "PROFILE" twice.
				variant.highlightsTitle ?? messages.experience.targetFitTitle,
				`<ul class="highlights">${variant.highlights
					.map(
						(item) =>
							`<li><span class="highlightLabel">${escapeHtml(item.title)}:</span> ${escapeHtml(item.body)}</li>`,
					)
					.join('')}</ul>`,
			)
		: ''

	const skillsSection = section(
		messages.skills.eyebrow,
		`<dl class="skills">${skills
			.map(
				({ id }) =>
					`<dt>${escapeHtml(messages.skills.entries[id].title)}</dt>` +
					`<dd>${escapeHtml(messages.skills.entries[id].description)}</dd>`,
			)
			.join('')}</dl>`,
	)

	const experienceSection = section(
		messages.experience.eyebrow,
		`<ol class="experience">${ordered
			.map((entry) => {
				const copy = messages.experience.entries[entry.id]
				const allBullets = Object.values(copy.descriptions ?? {}).filter(
					(line) => line.trim() !== copy.summary.trim(),
				)
				// A one-item list is not a list. Where an entry has a single
				// bullet it invariably restates the summary (blueghost does so
				// verbatim in English and as a paraphrase in Czech), and printing
				// both reads as a duplication bug.
				const bullets = allBullets.length > 1 ? allBullets : []
				return `<li class="entry">
					<div class="entryHead">
						<p class="entryRole">${escapeHtml(copy.title)} <span class="entryCompany">· ${escapeHtml(entry.company)}</span></p>
						<p class="entryPeriod">${escapeHtml(formatPeriod(entry.start, entry.end, locale, present))}</p>
					</div>
					<p class="entrySummary">${escapeHtml(copy.summary)}</p>
					${
						bullets.length
							? `<ul class="entryBullets">${bullets.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`
							: ''
					}
				</li>`
			})
			.join('')}</ol>
		${
			earlier?.length
				? `<p class="earlier"><strong>${escapeHtml(messages.experience.earlierExperience.title)}:</strong> ${earlier
						.map((entry) => {
							const copy = messages.experience.earlierExperience.entries[entry.id]
							return `${escapeHtml(copy.title)} · ${escapeHtml(entry.company)} (${entry.start}–${entry.end}) — ${escapeHtml(copy.summary)}`
						})
						.join(' · ')}</p>`
				: ''
		}`,
	)

	const educationSection = section(
		messages.education.eyebrow,
		`<div class="twoUp">
			<ul class="plainList">${education
				.map(
					(item) =>
						`<li><strong>${escapeHtml(item.institution)}</strong> (${item.start}–${item.end})<br>${escapeHtml(
							messages.education.entries[item.id].degree,
						)}</li>`,
				)
				.join('')}</ul>
			<ul class="plainList">${languages
				.map(
					({ id }) =>
						`<li><strong>${escapeHtml(messages.education.languages[id].name)}</strong> — ${escapeHtml(
							messages.education.languages[id].level,
						)}</li>`,
				)
				.join('')}</ul>
		</div>`,
	)

	return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(cv.person.name)} — ${escapeHtml(headline)}</title>
<style>${fontCss}</style>
<style>${tokensCss}</style>
<style>${printCss}</style>
</head>
<body>
	<header class="header">
		<h1 class="name">${escapeHtml(cv.person.name)}</h1>
		<p class="tagline">${escapeHtml(headline)}</p>
		<p class="contact">${contactParts.map((part) => `<span>${escapeHtml(part)}</span>`).join('')}</p>
	</header>

	${section(messages.highlights.eyebrow, `<p class="summary">${escapeHtml(summary)}</p>`)}
	${highlightsSection}
	${skillsSection}
	${experienceSection}
	${educationSection}
</body>
</html>`
}

function section(title, body) {
	return `<section class="section">
		<h2 class="sectionTitle">${escapeHtml(title)}</h2>
		${body}
	</section>`
}
