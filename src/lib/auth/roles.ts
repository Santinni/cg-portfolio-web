export const editorialRoles = ['admin', 'publisher', 'editor', 'author'] as const

export type EditorialRole = (typeof editorialRoles)[number]

export type EditorialUser = {
  author?: number | string | { id: number | string } | null
  id: number | string
  role?: EditorialRole | null
}

export const asEditorialUser = (value: unknown): EditorialUser | null => {
  if (!value || typeof value !== 'object' || !('id' in value)) return null
  return value as EditorialUser
}

export const hasRole = (
  user: EditorialUser | null,
  roles: readonly EditorialRole[],
): boolean => Boolean(user?.role && roles.includes(user.role))

export const isAdmin = (user: EditorialUser | null): boolean => hasRole(user, ['admin'])

export const canManageEditorialContent = (user: EditorialUser | null): boolean =>
  hasRole(user, ['admin', 'publisher', 'editor'])

export const canPublish = (user: EditorialUser | null): boolean =>
  hasRole(user, ['admin', 'publisher'])

export const getRelationshipID = (
  value: EditorialUser['author'],
): number | string | null => {
  if (typeof value === 'number' || typeof value === 'string') return value
  return value?.id ?? null
}
