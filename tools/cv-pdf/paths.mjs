import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Kept separate from data.mjs so modules needing only paths do not pull in
 * esbuild — it cannot initialise inside the jsdom test environment.
 */
export const toolDir = dirname(fileURLToPath(import.meta.url))
export const repoRoot = resolve(toolDir, '../..')
