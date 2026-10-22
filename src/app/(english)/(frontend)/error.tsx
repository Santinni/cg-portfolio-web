'use client'

// The unprefixed English tree is a separate root, so the localized boundary does not
// reach it; without this file an error under /work or /insights shows the framework page.
export { default } from '@/app/[locale]/(frontend)/error'
