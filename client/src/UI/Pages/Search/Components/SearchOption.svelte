<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  /* eslint-disable @typescript-eslint/restrict-template-expressions */

  import { _ } from 'svelte-i18n';
  import type { Optional } from '../../../../Shared/Types';
  import Menu from '../../../Components/Menu/Menu.svelte';
  import type { MenuItem } from '../../../Components/Menu/Models/MenuItem';

  export let title: string;
  export let items: any[];
  export let selectedOption: Optional<any> = undefined;
  export let allowUndefined: boolean = false;
  export let localizationPrefix: Optional<string> = undefined;

  let selectedItem: Optional<MenuItem<any>> = menuItemForItem(selectedOption);

  function menuItems(): MenuItem<any>[] {
    return items.map(menuItemForItem);
  }

  function menuItemForItem(item: any): MenuItem<any> {
    return {
      value: item,
      render: () => {
        if (localizationPrefix) {
          return `${$_(`${localizationPrefix}.${item}`)}`;
        }
        return `${item}`;
      }
    };
  }

  $: selectedOption = selectedItem?.value;
</script>

<div class="v-stack justify-items-stretch space-y-1">
  <h5 class="text-sm opacity-50">{title}</h5>
  <Menu items={menuItems()} {allowUndefined} bind:selectedItem />
</div>
