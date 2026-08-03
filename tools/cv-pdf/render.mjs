/**
 * Builds the CV document.
 *
 * The structure mirrors the approved 2026 React CV: centred masthead, then
 * summary, optional target-fit highlights, core skills, experience and
 * education. Every string comes from the message catalogs or the variant
 * overlay — no copy is written here, so translations stay in one place.
 */

const escapeHtml = (value) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')

const SEPARATOR = '<span class="entrySeparator">|</span>'

function formatPeriod(start, end, locale, presentLabel) {
	const format = (value) => {
		if (!value.includes('-')) return value // year-only, e.g. earlier experience
		const [year, month] = value.split('-').map(Number)
		return `${String(month).padStart(2, '0')}/${year}`
	}
	return `${format(start)} – ${end ? format(end) : presentLabel}`
}

export function renderCv({
	facts,
	messages,
	variant,
	locale,
	tokensCss,
	fontCss,
	printCss,
	qrSvg,
}) {
	const {
		curriculumVitae: cv,
		curriculumVitaeExperience: experience,
		curriculumVitaeEarlierExperience: earlier,
		curriculumVitaeSkills: skills,
		curriculumVitaeEducation: education,
		curriculumVitaeLanguages: languages,
	} = facts

	const clean = (list) => list?.filter((id) => !id.startsWith('$')) ?? []
	const hidden = new Set(clean(variant?.hideExperience))
	const emphasised = clean(variant?.emphasizeExperience)

	const visible = experience.filter((entry) => !hidden.has(entry.id))
	const ordered = [
		...emphasised.map((id) => visible.find((entry) => entry.id === id)).filter(Boolean),
		...visible.filter((entry) => !emphasised.includes(entry.id)),
	]

	const headline = variant?.headline ?? messages.hero.role

	// A variant may replace the whole summary with a single targeted paragraph;
	// otherwise the multi-paragraph professional summary is used.
	const summaryParagraphs = variant?.summary
		? [variant.summary]
		: Object.values(messages.profile.paragraphs)

	// The original states the role followed by its defining technologies.
	const tagline = [headline, ...(variant?.taglineKeywords ?? [])].join(
		` <span class="entrySeparator">|</span> `,
	)

	const contactLine = [
		escapeHtml(messages.contact.location),
		escapeHtml(cv.contact.phone),
		`<a href="${escapeHtml(cv.contact.emailHref)}">${escapeHtml(cv.contact.email)}</a>`,
		`<a href="${escapeHtml(cv.contact.linkedin)}">LinkedIn</a>`,
		`<a href="${escapeHtml(cv.contact.github)}">GitHub</a>`,
		`<a href="${escapeHtml(cv.contact.website)}">${escapeHtml(cv.contact.websiteLabel)}</a>`,
	].join(`<span class="contactSeparator">|</span>`)

	const highlightsSection = variant?.highlights?.length
		? section(
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
				const bullets = Object.values(copy.descriptions ?? {}).filter(
					(line) => line.trim() !== copy.summary.trim(),
				)
				// Where an entry has a single bullet it restates the summary; a
				// one-item list is not a list.
				const body = bullets.length > 1 ? bullets : [copy.summary]

				return `<li class="entry">
					<p class="entryHead">${escapeHtml(copy.title)}${SEPARATOR}<span class="entryCompany">${escapeHtml(entry.company)}</span>${SEPARATOR}<span class="entryPeriod">${escapeHtml(
						formatPeriod(entry.start, entry.end, locale, messages.experience.presentLabel),
					)}</span></p>
					${
						entry.stack?.length
							? `<p class="entryStack"><span class="entryStackLabel">${escapeHtml(messages.experience.stackLabel)}:</span> ${escapeHtml(entry.stack.join(', '))}</p>`
							: ''
					}
					<ul class="entryBullets">${body.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
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
						`<li><strong>${escapeHtml(item.institution)}</strong> <span class="muted">(${item.start}–${escapeHtml(
							item.end ?? messages.education.ongoingLabel,
						)})</span><br><span class="muted">${escapeHtml(
							messages.education.entries[item.id].degree,
						)}</span></li>`,
				)
				.join('')}</ul>
			<ul class="plainList">${languages
				.map(
					({ id }) =>
						`<li><strong>${escapeHtml(messages.education.languages[id].name)}</strong> <span class="muted">— ${escapeHtml(
							messages.education.languages[id].level,
						)}</span></li>`,
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
		<p class="tagline">${tagline}</p>
		<p class="contact">${contactLine}</p>
		${qrSvg ? `<div class="qr">${qrSvg}</div>` : ''}
	</header>

	${section(
		messages.profile.title,
		summaryParagraphs.map((text) => `<p class="summary">${escapeHtml(text)}</p>`).join(''),
	)}
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
