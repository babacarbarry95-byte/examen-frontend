export function sanitizeName(value: string) {
  // Keep letters (including accents), spaces, apostrophes and hyphens.
  return value.replace(/[^\p{L}\s'-]/gu, "");
}

export function sanitizePhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

