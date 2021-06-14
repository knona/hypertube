export function removeNonAlphaNumericChars(str: string): string {
  return str
    .split('')
    .filter(letter => /[a-zA-Z0-9]/.test(letter))
    .join('');
}
