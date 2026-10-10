// Whether text is a way to reach someone: an email address, or a phone number
// of 10 to 15 digits with the usual separators. The same rule the API applies
// (api/apps/contact/leads.py), so a typo is caught before anything is sent.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?[\d\s().-]+$/

export function reachable(text) {
  const value = text.trim()
  if (EMAIL.test(value)) return true
  const digits = value.replace(/\D/g, '').length
  return PHONE.test(value) && digits >= 10 && digits <= 15
}
