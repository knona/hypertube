<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { IconType } from '../../../Components/Icon/Models/IconType';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';
  import { AuthenticationType } from '../Models/AuthenticationType';

  export let authenticationType: AuthenticationType = AuthenticationType.login;

  function authenticate(): void {
    window.location.href =
      'https://api.intra.42.fr/oauth/authorize?client_id=c4d89c345383ed66a47fb6ad18c82d8d50f69a088c84a52250b9846dfb64575f&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2F42&response_type=code';
  }
</script>

<div class="v-stack justify-items-stretch" id="google-button">
  {#if authenticationType === AuthenticationType.login}
    <RoundedButton
      title={$_('page.welcome.components.ftAuthenticationButton.login')}
      icon={IconType.ft}
      spacing={4}
      on:click={authenticate}
    />
  {:else}
    <RoundedButton
      title={$_('page.welcome.components.ftAuthenticationButton.signin')}
      icon={IconType.ft}
      spacing={4}
      on:click={authenticate}
    />
  {/if}
</div>
