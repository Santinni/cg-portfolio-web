import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

/** Payload CMS collection for contact information (email, phone, social links). */
export const Contact: CollectionConfig = {
	slug: 'contact',
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
			name: 'email',
			type: 'email',
			required: true,
		},
		{
			name: 'phone',
			type: 'text',
			required: false,
			validate: (value: string | null | undefined) => {
				if (value && !/^\+?[0-9\s\-()]{6,20}$/.test(value)) {
					return 'Please enter a valid phone number'
				}
				return true
			},
		},
		{
			name: 'linkedin',
			type: 'text',
			required: false,
			validate: (value: string | null | undefined) => {
				if (value && !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(value)) {
					return 'Please enter a valid LinkedIn URL'
				}
				return true
			},
		},
		{
			name: 'github',
			type: 'text',
			required: false,
			validate: (value: string | null | undefined) => {
				if (value && !/^https?:\/\/(www\.)?github\.com\/.+/.test(value)) {
					return 'Please enter a valid GitHub URL'
				}
				return true
			},
		},
	],
}
