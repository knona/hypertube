export function backLanguageForLanguage(language: string): string {
  switch (language) {
    case 'en':
      return 'EN';
    case 'fr':
      return 'FR';
    default:
      return 'EN';
  }
}
