<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Navigation from '../../../../Modules/Navigation/Navigation';
  import Button from '../../../Components/Button/Button.svelte';
  import { IconType } from '../../../Components/Icon/Models/IconType';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';
  import { AuthenticationType } from '../Models/AuthenticationType';
  import FtAuthenticationButton from './FTAuthenticationButton.svelte';
  import GoogleAuthenticationButton from './GoogleAuthenticationButton.svelte';
  import LoginEmailForm from './LoginEmailForm.svelte';

  export let authenticationType: AuthenticationType;

  let shouldDisplayEmailForm: boolean = false;

  function showLoginEmailForm(): void {
    shouldDisplayEmailForm = true;
  }

  function switchToSignin(): void {
    authenticationType = AuthenticationType.signin;
  }

  function goToForgotPage(): void {
    Navigation.navigateTo('auth/forgot');
  }
</script>

<div class="w-screen page-padding v-stack center-content items-center space-y-4">
  <div id="modal-container" class="w-full space-y-2">
    <div class="p-8 w-full space-y-6 text-center rounded-lg bg-black bg-opacity-30">
      <h1 class="text-xl font-bold">{$_('page.welcome.components.loginModal.title')}</h1>
      <div class="flex flex-col items-stretch space-y-2">
        <GoogleAuthenticationButton authenticationType={AuthenticationType.login} />
        <FtAuthenticationButton authenticationType={AuthenticationType.login} />

        <div class="w-full px-8 py-2 space-x-3 flex flex-row items-center justify-evenly">
          <div class="h-px w-full bg-white opacity-20" />
          <h5>{$_('page.welcome.components.loginModal.or')}</h5>
          <div class="h-px w-full bg-white opacity-20" />
        </div>

        {#if shouldDisplayEmailForm}
          <LoginEmailForm />
        {:else}
          <RoundedButton
            title={$_('page.welcome.components.loginModal.loginEmailButton.title')}
            icon={IconType.email}
            spacing={4}
            on:click={showLoginEmailForm}
          />
        {/if}
      </div>

      <div class="text-sm">
        <h3 class="text-secondary-text">{$_('page.welcome.components.loginModal.noAccountDescription')}</h3>
        <Button title={$_('page.welcome.components.loginModal.signinButton.title')} on:click={switchToSignin} />
      </div>
    </div>

    <div class="p-8 rounded-lg bg-black bg-opacity-30 v-stack items-center text-sm">
      <div class="text-center text-secondary-text">
        {$_('page.welcome.components.loginModal.forgotPasswordDescription')}
      </div>
      <Button title={$_('page.welcome.components.loginModal.resetPasswordButton.title')} on:click={goToForgotPage} />
    </div>
  </div>
</div>

<style>
  #modal-container {
    max-width: 400px;
  }
</style>
