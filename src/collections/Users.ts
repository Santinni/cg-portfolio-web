import type { CollectionConfig } from 'payload'

import {
  adminFieldAccess,
  adminsOnly,
  readOwnUserOrAdmin,
  updateOwnUserOrAdmin,
} from '../access/editorial'
import {
  asEditorialUser,
  editorialRoles,
  isAdmin,
} from '../lib/auth/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: async ({ req }) => {
      if (isAdmin(asEditorialUser(req.user))) return true
      if (req.user) return false
      const result = await req.payload.count({
        collection: 'users',
        overrideAccess: true,
      })
      return result.totalDocs === 0
    },
    delete: adminsOnly,
    read: readOwnUserOrAdmin,
    update: updateOwnUserOrAdmin,
  },
  admin: {
    defaultColumns: ['displayName', 'email', 'role'],
    useAsTitle: 'displayName',
  },
  auth: true,
  fields: [
    { name: 'displayName', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      access: { create: adminFieldAccess, update: adminFieldAccess },
      defaultValue: 'author',
      options: [...editorialRoles],
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      access: { create: adminFieldAccess, update: adminFieldAccess },
      relationTo: 'authors',
      unique: true,
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && !req.user) {
          const result = await req.payload.count({
            collection: 'users',
            overrideAccess: true,
          })
          if (result.totalDocs === 0 && data) data.role = 'admin'
        }
        return data
      },
    ],
  },
}
