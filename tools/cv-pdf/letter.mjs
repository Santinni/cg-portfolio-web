/**
 * Builds a cover letter that shares the CV's masthead, tokens and type scale.
 *
 * The letter is prose for one application, so unlike the CV its body comes
 * from the letter file rather than the message catalogs. The identity layer
 * (name, contact line, footer) still comes from the shared facts, so the
 * letter cannot print a different phone number than the CV it accompanies.
 */

import { section } from './render.mjs'

const escapeHtml = (value) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')

const LETTER_KEYS = [
	'$comment',
	'slug',
	'locale',
	'headline',
	'date',
	'recipient',
	'subject',
	'salutation',
	'paragraphs',
	'closing',
	'enclosuresLabel',
	'enclosures',
]

export function validateLetter(letter, label = 'letter') {
	if (!letter || typeof letter !== 'object' || Array.isArray(letter)) {
		throw new Error(`Letter "${label}" must be a JSON object.`)
	}
	const unknown = Object.keys(letter).filter((key) => !LETTER_KEYS.includes(key))
	if (unknown.length > 0) {
		throw new Error(`Letter "${label}" sets unknown keys: ${unknown.join(', ')}.`)
	}
	for (const key of ['date', 'subject', 'salutation', 'closing']) {
		if (typeof letter[key] !== 'string' || !letter[key].trim()) {
			throw new Error(`Letter "${label}": ${key} must be a non-empty string.`)
		}
	}
	if (!/^\d{4}-\d{2}-\d{2}$/.test(letter.date)) {
		throw new Error(`Letter "${label}": date must be YYYY-MM-DD.`)
	}
	if (!Array.isArray(letter.paragraphs) || letter.paragraphs.length === 0) {
		throw new Error(`Letter "${label}": paragraphs must be a non-empty array.`)
	}
	if (letter.recipient !== undefined && !Array.isArray(letter.recipient)) {
		throw new Error(`Letter "${label}": recipient must be an array of lines.`)
	}
	return letter
}

export function formatLetterDate(isoDate, locale) {
	const [year, month, day] = isoDate.split('-').map(Number)
	return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(
		new Date(Date.UTC(year, month - 1, day)),
	)
}

export function renderLetter({ facts, messages, letter, locale, tokensCss, fontCss, printCss }) {
	const { curriculumVitae: cv } = facts
	const headline = letter.headline ?? messages.hero.role

	const contactLine = [
		escapeHtml(messages.contact.location),
		escapeHtml(cv.contact.phone),
		`<a href="${escapeHtml(cv.contact.emailHref)}">${escapeHtml(cv.contact.email)}</a>`,
		`<a href="${escapeHtml(cv.contact.linkedin)}">LinkedIn</a>`,
		`<a href="${escapeHtml(cv.contact.website)}">${escapeHtml(cv.contact.websiteLabel)}</a>`,
	].join(`<span class="contactSeparator">|</span>`)

	const recipient = letter.recipient?.length
		? `<p class="letterRecipient">${letter.recipient.map(escapeHtml).join('<br>')}</p>`
		: '<p class="letterRecipient"></p>'

	const enclosures = letter.enclosures?.length
		? `<p class="letterEnclosures"><strong>${escapeHtml(letter.enclosuresLabel ?? '')}</strong> ${letter.enclosures
				.map(escapeHtml)
				.join(' · ')}</p>`
		: ''

	return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(cv.person.name)} — ${escapeHtml(letter.subject)}</title>
<style>${fontCss}</style>
<style>${tokensCss}</style>
<style>${printCss}</style>
</head>
<body>
	<header class="header">
		<h1 class="name">${escapeHtml(cv.person.name)}</h1>
		<p class="tagline">${escapeHtml(headline)}</p>
		<p class="contact">${contactLine}</p>
	</header>

	<div class="letterMeta">
		${recipient}
		<p class="letterDate">${escapeHtml(formatLetterDate(letter.date, locale))}</p>
	</div>

	${section(
		letter.subject,
		`<p class="letterSalutation">${escapeHtml(letter.salutation)}</p>
		${letter.paragraphs.map((text) => `<p class="letterParagraph">${escapeHtml(text)}</p>`).join('')}
		<p class="letterClosing">${escapeHtml(letter.closing)}</p>
		<p class="letterSignature">${escapeHtml(cv.person.name)}</p>
		${enclosures}`,
	)}
</body>
</html>`
}
