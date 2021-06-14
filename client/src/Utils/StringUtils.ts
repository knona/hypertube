export function isAlphaNum(string: string): boolean {
  return /^[0-9a-z]+$/.test(string);
}
