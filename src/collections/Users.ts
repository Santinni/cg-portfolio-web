import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

/**
 * User roles available in the system.
 * - admin: Full access to all content and user management
 * - editor: Can read and update content, but cannot manage users
 */
type UserRole = 'admin' | 'editor'

/**
 * Extended user type that includes JWT-saved fields.
 * The `roles` field is persisted to JWT via `saveToJWT: true`
 * but isn't reflected in the auto-generated payload-types.
 */
interface UserWithRoles {
	id?: number
	roles?: UserRole[]
}

const hasAdminRole = (user: UserWithRoles | null | undefined): boolean =>
	user?.roles?.includes('admin') ?? false

export const Users: CollectionConfig = {
	slug: 'users',
	admin: {
		useAsTitle: 'email',
	},
	auth: true,
	access: {
		read: authenticated,
		create: ({ req: { user } }) => hasAdminRole(user as UserWithRoles),
		update: ({ req: { user } }) => {
			if (hasAdminRole(user as UserWithRoles)) return true
			return { id: { equals: user?.id } }
		},
		delete: ({ req: { user } }) => hasAdminRole(user as UserWithRoles),
	},
	fields: [
		{
			name: 'roles',
			type: 'select',
			hasMany: true,
			options: [
				{ label: 'Admin', value: 'admin' },
				{ label: 'Editor', value: 'editor' },
			],
			defaultValue: ['editor'],
			required: true,
			saveToJWT: true,
			access: {
				update: ({ req: { user } }) => hasAdminRole(user as UserWithRoles),
			},
		},
	],
}
