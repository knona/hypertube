<script lang="ts">
  import type { User } from '../../../../Models/User';
  import { currentUserStore } from '../../../../Modules/Store/CurrentUser/CurrentUserStore';
  import type { Optional } from '../../../../Shared/Types';
  import Redirect from '../../Redirect/Redirect.svelte';

  export let redirectUrl: string = '/';

  function checkIfLogged(): boolean {
    const user: Optional<User> = $currentUserStore.user as Optional<User>;
    return !!user;
  }
</script>

{#if checkIfLogged()}
  <slot />
{:else}
  <Redirect to={redirectUrl} />
{/if}
