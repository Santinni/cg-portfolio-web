import type { Access } from 'payload'

/** Unrestricted access — allows every request regardless of auth status. */
export const anyone: Access = () => true
