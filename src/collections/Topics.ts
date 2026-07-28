import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { adminsOnly, manageEditorial } from '../access/editorial'
import { anyone } from '../access/anyone'
import { asEditorialUser, isAdmin } from '../lib/auth/roles'

const preserveStableTopicSlug: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  if (originalDoc?.slug && data.slug && data.slug !== originalDoc.slug && !isAdmin(asEditorialUser(req.user))) {
    throw new Error('A topic slug is stable and can only be changed by an administrator.')
  }
  return data
}

export const Topics: CollectionConfig = {
  slug: 'topics',
  access: { create: manageEditorial, delete: adminsOnly, read: anyone, update: manageEditorial },
  admin: { defaultColumns: ['label', 'slug', 'order'], useAsTitle: 'label' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'slug', type: 'text', index: true, required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'order', type: 'number', defaultValue: 0, required: true },
  ],
  hooks: { beforeChange: [preserveStableTopicSlug] },
}
