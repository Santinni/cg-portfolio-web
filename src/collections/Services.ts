import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

/** Payload CMS collection for service offerings (title, description, icon). */
export const Services: CollectionConfig = {
	slug: 'services',
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
			name: 'description',
			type: 'textarea',
			required: true,
			maxLength: 500,
		},
		{
			name: 'icon',
			type: 'text',
			maxLength: 50,
		},
	],
}
