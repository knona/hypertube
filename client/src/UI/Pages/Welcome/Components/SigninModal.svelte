<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Button from '../../../Components/Button/Button.svelte';
  import { IconType } from '../../../Components/Icon/Models/IconType';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';
  import { AuthenticationType } from '../Models/AuthenticationType';
  import FtAuthenticationButton from './FTAuthenticationButton.svelte';
  import GoogleAuthenticationButton from './GoogleAuthenticationButton.svelte';
  import SigninEmailForm from './SigninEmailForm.svelte';

  export let authenticationType: AuthenticationType;

  let shouldDisplayEmailForm: boolean = false;

  function showSigninEmailForm(): void {
    shouldDisplayEmailForm = true;
  }

  function switchToLogin(): void {
    authenticationType = AuthenticationType.login;
  }
</script>

<div class="w-screen page-padding v-stack center-content items-center space-y-4">
  <div id="modal-container" class="p-8 w-full space-y-6 text-center rounded-lg bg-black bg-opacity-30">
    <h1 class="text-xl font-bold">{$_('page.welcome.components.signinModal.title')}</h1>

    <div class="v-stack items-stretch space-y-2">
      <GoogleAuthenticationButton authenticationType={AuthenticationType.signin} />
      <FtAuthenticationButton authenticationType={AuthenticationType.signin} />

      <div class="w-full px-8 py-2 space-x-3 flex flex-row items-center justify-evenly">
        <div class="h-px w-full bg-white opacity-20" />
        <h5>{$_('page.welcome.components.signinModal.or')}</h5>
        <div class="h-px w-full bg-white opacity-20" />
      </div>

      {#if shouldDisplayEmailForm}
        <SigninEmailForm />
      {:else}
        <RoundedButton
          title={$_('page.welcome.components.signinModal.signinEmailButton.title')}
          icon={IconType.email}
          spacing={4}
          on:click={showSigninEmailForm}
        />
      {/if}
    </div>
    <div class="text-sm">
      <h3 class="text-secondary-text">{$_('page.welcome.components.signinModal.accountDescription')}</h3>
      <Button title={$_('page.welcome.components.signinModal.loginButton.title')} on:click={switchToLogin} />
    </div>
  </div>
</div>

<style>
  #modal-container {
    max-width: 400px;
  }
</style>
