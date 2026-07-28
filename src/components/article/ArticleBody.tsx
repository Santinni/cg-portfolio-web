import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

import type { PublicPost } from '@/lib/content/publicContent'

import { Callout, type CalloutTone } from './Callout'
import { CodeBlock } from './CodeBlock'

type BlockFields = Record<string, unknown>

const getFields = (node: unknown): BlockFields => {
	if (!node || typeof node !== 'object' || !('fields' in node)) return {}
	const fields = node.fields
	return fields && typeof fields === 'object' ? (fields as BlockFields) : {}
}

const isCalloutTone = (tone: unknown): tone is CalloutTone =>
	tone === 'info' || tone === 'success' || tone === 'warning' || tone === 'danger'

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
	...defaultConverters,
	blocks: {
		...defaultConverters.blocks,
		callout: ({ node }: { node: unknown }) => {
			const fields = getFields(node)
			const body = typeof fields.body === 'string' ? fields.body : ''
			const title = typeof fields.title === 'string' ? fields.title : undefined

			return (
				<Callout title={title} tone={isCalloutTone(fields.tone) ? fields.tone : 'info'}>
					<p>{body}</p>
				</Callout>
			)
		},
		codeBlock: ({ node }: { node: unknown }) => {
			const fields = getFields(node)

			return (
				<CodeBlock
					code={typeof fields.source === 'string' ? fields.source : ''}
					language={typeof fields.language === 'string' ? fields.language : 'text'}
				/>
			)
		},
	},
})

interface ArticleBodyProps {
	content: PublicPost['content']
}

export function ArticleBody({ content }: ArticleBodyProps) {
	return <RichText converters={converters} data={content} />
}
