import type { CollectionConfig } from 'payload'

import { adminsOnly, manageEditorial } from '../access/editorial'
import { anyone } from '../access/anyone'

export const Authors: CollectionConfig = {
	slug: 'authors',
	access: { create: manageEditorial, delete: adminsOnly, read: anyone, update: manageEditorial },
	admin: { defaultColumns: ['name', 'role'], useAsTitle: 'name' },
	fields: [
		{ name: 'name', type: 'text', required: true },
		{ name: 'role', type: 'text', required: true },
		{ name: 'expertise', type: 'text', hasMany: true },
		{ name: 'biography', type: 'textarea', required: true },
		{ name: 'portrait', type: 'upload', relationTo: 'media' },
		{
			name: 'socialLinks',
			type: 'group',
			fields: [
				{ name: 'website', type: 'text' },
				{ name: 'linkedin', type: 'text' },
				{ name: 'github', type: 'text' },
			],
		},
	],
}
