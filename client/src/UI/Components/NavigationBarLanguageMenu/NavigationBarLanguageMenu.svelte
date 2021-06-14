<script lang="ts">
  import { locale, _ } from 'svelte-i18n';
  import { preferences } from '../../../Modules/Store/Preference/PreferenceStore';
  import { availableLanguages } from '../../../Shared/Constants';
  import Menu from '../Menu/Menu.svelte';
  import type { MenuItem } from '../Menu/Models/MenuItem';

  let selectedMenuItem: MenuItem<string> = menuItemForLanguage($preferences.language);

  function updateLanguage(language: string): void {
    if ($preferences.language === language) {
      return;
    }
    preferences.setLanguage(language);
    locale.set(language);
    document.location.reload();
  }

  function menuItemForLanguage(language: string): MenuItem<string> {
    return {
      value: language,
      render: () => $_(`languages.${language}`) as string
    };
  }

  function languagesMenuItems(): MenuItem<string>[] {
    return availableLanguages.map(menuItemForLanguage);
  }

  function languageForMenuItem(menuItem: MenuItem<string>): string {
    return menuItem.value;
  }

  $: updateLanguage(languageForMenuItem(selectedMenuItem));
</script>

<Menu
  items={languagesMenuItems()}
  textColor="white"
  backgroundColor="transparent"
  topPadding={0}
  leftPadding={0}
  rightPadding={7}
  bottomPadding={0}
  rounded="none"
  bind:selectedItem={selectedMenuItem}
/>
