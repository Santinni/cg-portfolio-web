import enMessages from '../../../messages/en.json'

/** Mutable catalog handle for the `next-intl/server` mock in `site-footer.test.tsx`. */
export let messages: typeof enMessages = enMessages

export function setMessages(next: typeof enMessages) {
	messages = next
}
