import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

/** Payload CMS collection for the "About" section content (title, rich-text, image). */
export const About: CollectionConfig = {
	slug: 'about',
	admin: {
		useAsTitle: 'title',
	},
	access: {
		read: anyone,
		create: authenticated,
		update: authenticated,
		delete: authenticated,
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
			name: 'content',
			type: 'richText',
			required: true,
		},
		{
			name: 'image',
			type: 'upload',
			relationTo: 'media',
			required: false,
		},
	],
}
