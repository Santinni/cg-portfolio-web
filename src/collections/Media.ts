import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import {
	authenticatedEditorial,
	authenticatedFieldRead,
	updateOwnMediaOrManage,
} from '../access/editorial'
import { asEditorialUser } from '../lib/auth/roles'
import {
	ALLOWED_MEDIA_MIME_TYPES,
	MAX_MEDIA_INPUT_PIXELS,
	assertMediaUploadIsAllowed,
	preventReferencedMediaDeletion,
} from '../lib/content/mediaGuards'
import { validateMediaAlt } from '../lib/content/validation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
	slug: 'media',
	access: {
		create: authenticatedEditorial,
		delete: updateOwnMediaOrManage,
		read: anyone,
		update: updateOwnMediaOrManage,
	},
	fields: [
		{
			name: 'decorative',
			type: 'checkbox',
			defaultValue: false,
			required: true,
		},
		{
			name: 'alt',
			type: 'text',
			validate: (
				value: null | string | undefined,
				{ siblingData }: { siblingData: { decorative?: boolean | null } },
			) => validateMediaAlt(value, siblingData),
		},
		{ name: 'caption', type: 'text' },
		{ name: 'credit', type: 'text' },
		{
			name: 'uploadedBy',
			type: 'relationship',
			relationTo: 'users',
			access: { read: authenticatedFieldRead },
			admin: { readOnly: true },
		},
	],
	hooks: {
		beforeDelete: [preventReferencedMediaDeletion],
		beforeValidate: [
			({ data, req }) => {
				assertMediaUploadIsAllowed(req.file)
				return data
			},
		],
		beforeChange: [
			({ data, operation, req }) => {
				const user = asEditorialUser(req.user)
				if (operation === 'create' && user) data.uploadedBy = user.id
				return data
			},
		],
	},
	upload: {
		staticDir: path.resolve(dirname, '../../public/media'),
		constructorOptions: { limitInputPixels: MAX_MEDIA_INPUT_PIXELS },
		resizeOptions: { withoutEnlargement: true },
		mimeTypes: [...ALLOWED_MEDIA_MIME_TYPES],
		adminThumbnail: 'thumbnail',
		focalPoint: true,
		imageSizes: [
			{
				name: 'thumbnail',
				width: 300,
				withoutEnlargement: true,
			},
			{
				name: 'square',
				width: 500,
				height: 500,
				withoutEnlargement: true,
			},
			{
				name: 'small',
				width: 600,
				withoutEnlargement: true,
			},
			{
				name: 'medium',
				width: 900,
				withoutEnlargement: true,
			},
			{
				name: 'large',
				width: 1400,
				withoutEnlargement: true,
			},
			{
				name: 'xlarge',
				width: 1920,
				withoutEnlargement: true,
			},
			{
				name: 'og',
				width: 1200,
				height: 630,
				crop: 'center',
				withoutEnlargement: true,
			},
		],
	},
}
