<script lang="ts">
  import { addMessages, getLocaleFromNavigator, init } from 'svelte-i18n';
  import { preferences } from '../Modules/Store/Preference/PreferenceStore';
  import en from '../Resources/Strings/en.json';
  import fr from '../Resources/Strings/fr.json';
  import { defaultLanguage } from '../Shared/Constants';
  import AppNavigation from './AppNavigation.svelte';
  import GlobalStyles from './GlobalStyles.svelte';

  function initLocalization(): void {
    addMessages('en', en);
    addMessages('fr', fr);
    init({
      fallbackLocale: defaultLanguage,
      initialLocale: ($preferences.language as string) ?? getLocaleFromNavigator()
    });
  }

  initLocalization();
</script>

<GlobalStyles />

<AppNavigation />
