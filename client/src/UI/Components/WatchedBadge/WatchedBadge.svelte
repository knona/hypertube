<script lang="ts">
  import { _ } from 'svelte-i18n';

  import Icon from '../Icon/Icon.svelte';
  import { IconType } from '../Icon/Models/IconType';
</script>

<div class="px-3 py-1 h-stack space-x-1 bg-white rounded-full">
  <div class="w-2.5 h-2.5 md:pt-0.5 text-black">
    <Icon type={IconType.checkmark} />
  </div>
  <h5 class="text-xs text-black font-semibold hidden md:block">{$_('component.watchedBadge.watched')}</h5>
</div>
