import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

/** Restricts access to authenticated (logged-in) users only. */
export const authenticated: isAuthenticated = ({ req: { user } }) => {
	return Boolean(user)
}
