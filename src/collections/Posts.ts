import {
	BlockquoteFeature,
	BlocksFeature,
	BoldFeature,
	FixedToolbarFeature,
	HeadingFeature,
	HorizontalRuleFeature,
	InlineCodeFeature,
	InlineToolbarFeature,
	ItalicFeature,
	LinkFeature,
	OrderedListFeature,
	ParagraphFeature,
	UnderlineFeature,
	UnorderedListFeature,
	UploadFeature,
	lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block, CollectionConfig } from 'payload'

import {
	authenticatedEditorial,
	publisherFieldAccess,
	publishedOrEditorialRead,
	updateOwnPostsOrManage,
} from '../access/editorial'
import { preparePost } from '../lib/content/postHooks'

const CodeBlock: Block = {
	slug: 'codeBlock',
	fields: [
		{
			name: 'language',
			type: 'select',
			defaultValue: 'text',
			options: ['text', 'typescript', 'javascript', 'tsx', 'jsx', 'css', 'html', 'json', 'bash'],
			required: true,
		},
		{ name: 'source', type: 'code', required: true },
	],
}

const CalloutBlock: Block = {
	slug: 'callout',
	fields: [
		{
			name: 'tone',
			type: 'select',
			defaultValue: 'info',
			options: ['info', 'success', 'warning', 'danger'],
			required: true,
		},
		{ name: 'title', type: 'text' },
		{ name: 'body', type: 'textarea', required: true },
	],
}

const articleEditor = lexicalEditor({
	features: [
		ParagraphFeature(),
		HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
		BoldFeature(),
		ItalicFeature(),
		UnderlineFeature(),
		InlineCodeFeature(),
		LinkFeature({ enabledCollections: [] }),
		OrderedListFeature(),
		UnorderedListFeature(),
		BlockquoteFeature(),
		HorizontalRuleFeature(),
		UploadFeature({
			collections: {
				media: {
					fields: [
						{ name: 'caption', type: 'text' },
						{ name: 'alt', type: 'text', required: true },
					],
				},
			},
			maxDepth: 1,
		}),
		BlocksFeature({ blocks: [CodeBlock, CalloutBlock] }),
		FixedToolbarFeature(),
		InlineToolbarFeature(),
	],
})

export const Posts: CollectionConfig = {
	slug: 'posts',
	access: {
		create: authenticatedEditorial,
		delete: updateOwnPostsOrManage,
		read: publishedOrEditorialRead,
		update: updateOwnPostsOrManage,
	},
	admin: {
		defaultColumns: ['title', 'author', '_status', 'publishedAt', 'updatedAt'],
		useAsTitle: 'title',
	},
	fields: [
		{ name: 'title', type: 'text', required: true },
		{ name: 'slug', type: 'text', index: true, required: true, unique: true },
		{ name: 'excerpt', type: 'textarea', maxLength: 320, required: true },
		{ name: 'content', type: 'richText', editor: articleEditor, required: true },
		{ name: 'featuredImage', type: 'upload', relationTo: 'media', required: true },
		{ name: 'socialImage', type: 'upload', relationTo: 'media' },
		{ name: 'socialTitle', type: 'text', maxLength: 100 },
		{ name: 'socialDescription', type: 'textarea', maxLength: 300 },
		{
			name: 'topics',
			type: 'relationship',
			hasMany: true,
			relationTo: 'topics',
			required: true,
		},
		{ name: 'author', type: 'relationship', relationTo: 'authors', required: true },
		{
			name: 'publishedAt',
			type: 'date',
			access: { update: publisherFieldAccess },
			admin: { date: { pickerAppearance: 'dayAndTime' }, position: 'sidebar' },
		},
		{
			name: 'firstPublishedAt',
			type: 'date',
			access: {
				create: () => false,
				update: () => false,
			},
			admin: { hidden: true, readOnly: true },
		},
		{ name: 'canonicalURL', type: 'text' },
		{ name: 'noIndex', type: 'checkbox', defaultValue: false },
		{ name: 'featured', type: 'checkbox', defaultValue: false },
		{
			name: 'relatedPosts',
			type: 'relationship',
			filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
			hasMany: true,
			maxRows: 4,
			relationTo: 'posts',
		},
		{
			name: 'readingTime',
			type: 'number',
			admin: { readOnly: true, position: 'sidebar' },
		},
		{
			name: 'meta',
			type: 'group',
			fields: [
				{ name: 'title', type: 'text', maxLength: 70 },
				{ name: 'description', type: 'textarea', maxLength: 170 },
				{ name: 'image', type: 'upload', relationTo: 'media' },
			],
		},
	],
	hooks: { beforeChange: [preparePost] },
	timestamps: true,
	versions: {
		drafts: { autosave: true, schedulePublish: true },
		maxPerDoc: 100,
	},
}
