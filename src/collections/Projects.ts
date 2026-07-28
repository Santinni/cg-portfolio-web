import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

/**
 * Payload CMS collection for portfolio projects.
 * Auto-generates a slug from the title via a `beforeChange` hook.
 */
export const Projects: CollectionConfig = {
	slug: 'projects',
	admin: {
		useAsTitle: 'title',
	},
	access: {
		read: anyone,
		create: authenticated,
		update: authenticated,
		delete: authenticated,
	},
	hooks: {
		beforeChange: [
			({ data }) => {
				if (data?.title) {
					data.slug = data.title
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, '-')
						.replace(/(^-|-$)/g, '')
				}
				return data
			},
		],
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true,
			minLength: 3,
			maxLength: 100,
		},
		{
			name: 'slug',
			type: 'text',
			unique: true,
			admin: {
				readOnly: true,
				position: 'sidebar',
			},
		},
		{
			name: 'description',
			type: 'textarea',
			maxLength: 500,
		},
		{
			name: 'image',
			type: 'upload',
			relationTo: 'media',
			required: true,
		},
		{
			name: 'link',
			type: 'text',
			validate: (value: string | null | undefined) => {
				if (value && !/^https?:\/\/.+/.test(value)) {
					return 'Link must be a valid URL starting with http:// or https://'
				}
				return true
			},
		},
		{
			name: 'technologies',
			type: 'array',
			maxRows: 20,
			fields: [
				{
					name: 'technology',
					type: 'text',
					required: true,
					maxLength: 50,
				},
			],
		},
	],
}
