<script lang="ts">
  import type { Optional } from '../../../../Shared/Types';

  export let title: Optional<string> = undefined;
</script>

<div class="w-full v-stack items-start space-y-3">
  {#if title}
    <h3 class="text-2xl font-bold">{title}</h3>
  {/if}
  <slot />
</div>
