<script lang="ts">
  /* eslint-disable max-len */

  import { _ } from 'svelte-i18n';
  import Authentication from '../../../Modules/Authentication/Authentication';
  import Navigation from '../../../Modules/Navigation/Navigation';
  import { currentUserStore } from '../../../Modules/Store/CurrentUser/CurrentUserStore';
  import { IconType } from '../Icon/Models/IconType';
  import type { MenuItem } from '../Menu/Models/MenuItem';
  import MenuButton from '../MenuButton/MenuButton.svelte';
  import { MenuButtonPosition } from '../MenuButton/Models/MenuButtonPosition';
  import RoundedButton from '../RoundedButton/RoundedButton.svelte';
  import { NavigationBarAuthenticationButtonType } from './Models/NavigationBarAuthenticationButtonType';

  function goToAuthentication(): void {
    Navigation.navigateTo('/');
  }

  function menuItems(): MenuItem<NavigationBarAuthenticationButtonType>[] {
    return [
      {
        value: NavigationBarAuthenticationButtonType.profile,
        render: () => {
          return `
          <div class="h-stack items-center">
            <div class="w-4 h-4 mr-2 text-black">
                <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM7 6v2a3 3 0 1 0 6 0V6a3 3 0 1 0-6 0zm-3.65 8.44a8 8 0 0 0 13.3 0 15.94 15.94 0 0 0-13.3 0z"/></svg>
            </div>
            ${$_('component.navigationBarAuthenticationButton.authenticationMenu.profile') as string}
          </div>`;
        }
      },
      {
        value: NavigationBarAuthenticationButtonType.logout,
        render: () => {
          return `
          <div class="h-stack items-center">
            <div class="w-4 h-4 mr-2 text-black">
                <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.16 4.16l1.42 1.42A6.99 6.99 0 0 0 10 18a7 7 0 0 0 4.42-12.42l1.42-1.42a9 9 0 1 1-11.69 0zM9 0h2v8H9V0z"/></svg>
            </div>
            ${$_('component.navigationBarAuthenticationButton.authenticationMenu.logout') as string}
          </div>`;
        }
      }
    ];
  }

  function menuItemSelected(event: CustomEvent<NavigationBarAuthenticationButtonType>): void {
    switch (event.detail) {
      case NavigationBarAuthenticationButtonType.profile:
        Navigation.navigateTo('/profile');
        break;
      case NavigationBarAuthenticationButtonType.logout:
        Authentication.logout();
        break;
    }
  }
</script>

{#if $currentUserStore.user}
  <MenuButton
    icon={IconType.userFill}
    items={menuItems()}
    menuPosition={MenuButtonPosition.bottomRight}
    menuWidth={52}
    textStyle="max-w-0 md:max-w-xs truncate"
    on:itemSelection={menuItemSelected}
  />
{:else}
  <div class="hidden md:block">
    <RoundedButton
      title={$_('component.navigationBarAuthenticationButton.loginButton.title')}
      on:click={goToAuthentication}
    />
  </div>
  <div class="md:hidden">
    <RoundedButton icon={IconType.userFill} on:click={goToAuthentication} />
  </div>
{/if}
