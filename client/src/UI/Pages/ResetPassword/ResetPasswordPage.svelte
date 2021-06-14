<script lang="ts">
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { ServerError } from '../../../Models/Server/Errors/ServerError';
  import Authentication from '../../../Modules/Authentication/Authentication';
  import Navigation from '../../../Modules/Navigation/Navigation';
  import { componentState } from '../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../Modules/Store/ComponentState/Models/State';
  import Validator from '../../../Modules/Validator/Validator';
  import type { Nullable } from '../../../Shared/Types';
  import Icon from '../../Components/Icon/Icon.svelte';
  import { IconType } from '../../Components/Icon/Models/IconType';
  import InfoMessage from '../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import RoundedButton from '../../Components/RoundedButton/RoundedButton.svelte';
  import { TextFieldType } from '../../Components/TextField/Models/TextFieldType';
  import TextFieldValidator from './../../Components/TextFieldValidator/TextFieldValidator.svelte';

  const urlParameters: URLSearchParams = new URLSearchParams(window.location.search);
  const token: Nullable<string> = urlParameters.get('token');
  const username: Nullable<string> = urlParameters.get('username');
  const canResetPassword: boolean = urlParameters.has('token') && urlParameters.has('username');

  let resetState: State<ServerError> = componentState();
  let password: string = '';
  let isPasswordValid: boolean = false;

  function resetPassword(): void {
    resetState.setLoading();
    Authentication.resetPassword(username ?? '', token ?? '', password)
      .then(() => Navigation.navigateTo('/'))
      .catch(resetState.setError);
  }

  onMount(() => {
    if (!canResetPassword) {
      Navigation.navigateTo('/');
    }
  });
</script>

<div class="page-padding center-content">
  <div class="w-full max-w-lg v-stack center-content padding-box space-y-4 text-center">
    <div class="w-10 h-10">
      <Icon type={IconType.key} />
    </div>
    {#if $resetState.current === ComponentStateType.loading}
      <LoadingIndicator />
    {:else if $resetState.current === ComponentStateType.error}
      <InfoMessage type={InfoMessageType.error}>
        <LocalizedServerError serverError={$resetState.error} />
      </InfoMessage>
    {:else}
      <div>
        <h1 class="text-xl font-bold">{$_('page.resetPassword.title')}</h1>
        <h2 class="text-sm">{$_('page.resetPassword.description')}</h2>
      </div>
      <form class="w-full max-w-xs v-stack justify-items-stretch space-y-2" on:submit|preventDefault={resetPassword}>
        <TextFieldValidator
          type={TextFieldType.password}
          placeholder={$_('page.resetPassword.passwordTextField.placeholder')}
          validator={Validator.password}
          bind:text={password}
          bind:isValid={isPasswordValid}
        />
        <div>
          <RoundedButton
            disabled={!isPasswordValid}
            title={$_('page.resetPassword.resetButton.title')}
            on:click={resetPassword}
          />
        </div>
      </form>
    {/if}
  </div>
</div>
