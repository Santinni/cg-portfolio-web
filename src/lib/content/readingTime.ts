const WORDS_PER_MINUTE = 200

const BLOCK_TEXT_FIELDS = {
	callout: ['title', 'body'],
	codeBlock: ['source'],
} as const

const collectBlockText = (value: object, fragments: string[]): void => {
	if (!('type' in value) || value.type !== 'block' || !('fields' in value)) return
	if (!value.fields || typeof value.fields !== 'object') return

	const fields = value.fields as Record<string, unknown>
	const blockType = fields.blockType
	if (typeof blockType !== 'string' || !(blockType in BLOCK_TEXT_FIELDS)) return

	const textFields = BLOCK_TEXT_FIELDS[blockType as keyof typeof BLOCK_TEXT_FIELDS]
	textFields.forEach((field) => {
		const text = fields[field]
		if (typeof text === 'string' && text.trim()) fragments.push(text)
	})
}

const collectText = (value: unknown, fragments: string[], seen: Set<object>): void => {
	if (typeof value === 'string') return
	if (!value || typeof value !== 'object' || seen.has(value)) return

	seen.add(value)
	if ('text' in value && typeof value.text === 'string') fragments.push(value.text)
	collectBlockText(value, fragments)

	if (Array.isArray(value)) {
		value.forEach((item) => collectText(item, fragments, seen))
		return
	}

	Object.values(value).forEach((item) => collectText(item, fragments, seen))
}

export const extractLexicalText = (content: unknown): string => {
	const fragments: string[] = []
	collectText(content, fragments, new Set())
	return fragments.join(' ').replace(/\s+/g, ' ').trim()
}

export const calculateReadingTime = (content: unknown): number => {
	const text = extractLexicalText(content)
	if (!text) return 0
	return Math.max(1, Math.ceil(text.split(/\s+/u).length / WORDS_PER_MINUTE))
}
