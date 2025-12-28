// Storage key for last used email
const LAST_EMAIL_KEY = 'controle-financeiro-last-email'

/**
 * Get last used email from localStorage
 */
export function getLastUsedEmail(): string | null {
  return localStorage.getItem(LAST_EMAIL_KEY)
}

/**
 * Save last used email to localStorage
 */
export function saveLastUsedEmail(email: string): void {
  localStorage.setItem(LAST_EMAIL_KEY, email)
}
