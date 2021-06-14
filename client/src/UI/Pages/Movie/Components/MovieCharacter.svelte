<script lang="ts">
  import type { Director } from '../../../../Models/Director';
  import type { Optional } from '../../../../Shared/Types';
  import Icon from '../../../Components/Icon/Icon.svelte';
  import { IconType } from '../../../Components/Icon/Models/IconType';
  import OptionalImage from '../../../Components/OptionalImage/OptionalImage.svelte';

  export let character: Director;
  export let role: Optional<string> = undefined;
</script>

<div class="w-20 md:w-32 v-stack items-center space-y-2">
  <div class="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden">
    <OptionalImage class="w-full h-full object-cover" src={character.profileUrl} alt={character.name}>
      <div class="w-full h-full p-12 bg-secondary-bg">
        <Icon type={IconType.user} />
      </div>
    </OptionalImage>
    <img class="w-full h-full object-cover" src={character.profileUrl} alt="Character" />
  </div>
  <div class="v-stack items-center">
    <h4 class="text-center font-semibold">{character.name}</h4>
    {#if role}
      <h5 class="text-center text-sm text-secondary-text">{role}</h5>
    {/if}
  </div>
</div>
