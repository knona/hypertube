<script lang="ts">
  import { InfoMessageType } from './Models/InfoMessageType';

  export let type: InfoMessageType = InfoMessageType.success;
</script>

{#if type === InfoMessageType.success}
  <div class="text-green-500 text-sm"><slot /></div>
{:else if type === InfoMessageType.error}
  <div class="text-red-500 text-sm"><slot /></div>
{/if}
