import type { Access, FieldAccess, Where } from 'payload'

import {
	asEditorialUser,
	canManageEditorialContent,
	canPublish,
	getRelationshipID,
	isAdmin,
} from '../lib/auth/roles'

export const authenticatedEditorial: Access = ({ req }) => Boolean(asEditorialUser(req.user))

export const manageEditorial: Access = ({ req }) =>
	canManageEditorialContent(asEditorialUser(req.user))

export const publishersOnly: Access = ({ req }) => canPublish(asEditorialUser(req.user))

export const adminsOnly: Access = ({ req }) => isAdmin(asEditorialUser(req.user))

export const publishedOrEditorialRead: Access = ({ req }) => {
	const user = asEditorialUser(req.user)
	if (canManageEditorialContent(user)) return true

	const authorID = getRelationshipID(user?.author)
	if (user?.role === 'author' && authorID) {
		const ownOrPublished: Where = {
			or: [{ _status: { equals: 'published' } }, { author: { equals: authorID } }],
		}
		return ownOrPublished
	}

	return { _status: { equals: 'published' } }
}

export const updateOwnPostsOrManage: Access = ({ req }) => {
	const user = asEditorialUser(req.user)
	if (canManageEditorialContent(user)) return true

	const authorID = getRelationshipID(user?.author)
	return user?.role === 'author' && authorID ? { author: { equals: authorID } } : false
}

export const updateOwnMediaOrManage: Access = ({ req }) => {
	const user = asEditorialUser(req.user)
	if (canManageEditorialContent(user)) return true
	return user?.role === 'author' ? { uploadedBy: { equals: user.id } } : false
}

export const readOwnUserOrAdmin: Access = ({ req }) => {
	const user = asEditorialUser(req.user)
	if (isAdmin(user)) return true
	return user ? { id: { equals: user.id } } : false
}

export const updateOwnUserOrAdmin = readOwnUserOrAdmin

export const adminFieldAccess: FieldAccess = ({ req }) => isAdmin(asEditorialUser(req.user))

export const publisherFieldAccess: FieldAccess = ({ req }) => canPublish(asEditorialUser(req.user))

export const authenticatedFieldRead: FieldAccess = ({ req }) => Boolean(asEditorialUser(req.user))
