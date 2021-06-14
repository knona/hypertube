<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { ServerError } from '../../../../Models/Server/Errors/ServerError';
  import Authentication from '../../../../Modules/Authentication/Authentication';
  import Navigation from '../../../../Modules/Navigation/Navigation';
  import { componentState } from '../../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../../Modules/Store/ComponentState/Models/State';
  import type { GapiAuth2AuthorizeResponse } from '../../../../Utils/GoogleUtils';
  import { gapiAuthorize, gapiLoad } from '../../../../Utils/GoogleUtils';
  import { IconType } from '../../../Components/Icon/Models/IconType';
  import InfoMessage from '../../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';
  import { AuthenticationType } from '../Models/AuthenticationType';

  export let authenticationType: AuthenticationType = AuthenticationType.login;
  export let ready: boolean = false;

  let state: State<ServerError> = componentState();

  function loginWithGoogle(code: string): void {
    Authentication.loginWithGoogle(code)
      .then(() => {
        state.setDefault();
        Navigation.navigateTo('/home');
      })
      .catch(state.setError);
  }

  async function openGoogleAuthenticator(): Promise<void> {
    state.setLoading();
    const params: gapi.auth2.AuthorizeConfig = {
      client_id: '1038106595102-5a932i8kr9rfuf28o5tm1frq9la91v0m.apps.googleusercontent.com',
      scope: 'email profile',
      response_type: 'code'
    };
    try {
      const res: GapiAuth2AuthorizeResponse = await gapiAuthorize(params);
      loginWithGoogle(res.code);
    } catch (error) {
      state.setError(error);
    }
  }

  async function onGoogleAuthenticationLoaded(): Promise<void> {
    await gapiLoad();
    ready = true;
  }
</script>

<svelte:head>
  <script src="https://apis.google.com/js/platform.js" on:load={onGoogleAuthenticationLoaded} async defer></script>
</svelte:head>

<div class="space-y-1">
  {#if $state.current === ComponentStateType.loading}
    <div class="v-stack items-center">
      <LoadingIndicator />
    </div>
  {:else}
    <div class="v-stack justify-items-stretch" id="google-button">
      {#if authenticationType === AuthenticationType.login}
        <RoundedButton
          title={$_('page.welcome.components.googleAuthenticationButton.login')}
          icon={IconType.google}
          spacing={4}
          on:click={openGoogleAuthenticator}
        />
      {:else}
        <RoundedButton
          title={$_('page.welcome.components.googleAuthenticationButton.signin')}
          icon={IconType.google}
          spacing={4}
          on:click={openGoogleAuthenticator}
        />
      {/if}
    </div>
    {#if $state.current === ComponentStateType.error}
      <InfoMessage type={InfoMessageType.error}>
        <LocalizedServerError serverError={$state.error} />
      </InfoMessage>
    {/if}
  {/if}
</div>
