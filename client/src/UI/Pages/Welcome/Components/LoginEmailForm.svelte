<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { ServerError } from '../../../../Models/Server/Errors/ServerError';
  import Authentication from '../../../../Modules/Authentication/Authentication';
  import Navigation from '../../../../Modules/Navigation/Navigation';
  import { componentState } from '../../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../../Modules/Store/ComponentState/Models/State';
  import InfoMessage from '../../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';
  import { TextFieldType } from '../../../Components/TextField/Models/TextFieldType';
  import TextField from '../../../Components/TextField/TextField.svelte';
  import LocalizedServerError from './../../../Components/LocalizedServerError/LocalizedServerError.svelte';

  let authenticationState: State<ServerError> = componentState();
  let login: string = '';
  let password: string = '';

  function loginWithEmail(): void {
    authenticationState.setLoading();
    Authentication.loginWithEmail(login, password)
      .then(() => {
        authenticationState.setDefault();
        Navigation.navigateTo('/home');
        return;
      })
      .catch(authenticationState.setError);
  }
</script>

<form class="flex flex-col space-y-2" on:submit|preventDefault={loginWithEmail}>
  <TextField placeholder={$_('page.welcome.components.loginEmailForm.loginTextField.placeholder')} bind:text={login} />
  <TextField
    type={TextFieldType.password}
    placeholder={$_('page.welcome.components.loginEmailForm.passwordTextField.placeholder')}
    bind:text={password}
  />

  {#if $authenticationState.current === ComponentStateType.error}
    <div class="w-full">
      <InfoMessage type={InfoMessageType.error}>
        <LocalizedServerError serverError={$authenticationState.error} />
      </InfoMessage>
    </div>
  {/if}

  {#if $authenticationState.current === ComponentStateType.loading}
    <div class="pt-2 v-stack w-full center-content">
      <LoadingIndicator />
    </div>
  {:else}
    <RoundedButton title={$_('page.welcome.components.loginEmailForm.loginButton.title')} />
  {/if}
</form>
