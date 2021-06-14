<script lang="ts">
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { ServerError } from '../../../Models/Server/Errors/ServerError';
  import Authentication from '../../../Modules/Authentication/Authentication';
  import Navigation from '../../../Modules/Navigation/Navigation';
  import { componentState } from '../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../Modules/Store/ComponentState/Models/State';
  import type { Nullable } from '../../../Shared/Types';
  import Button from '../../Components/Button/Button.svelte';
  import Icon from '../../Components/Icon/Icon.svelte';
  import { IconType } from '../../Components/Icon/Models/IconType';
  import InfoMessage from '../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import RoundedButton from '../../Components/RoundedButton/RoundedButton.svelte';

  const urlParameters: URLSearchParams = new URLSearchParams(window.location.search);
  const email: Nullable<string> = urlParameters.get('email');
  const username: Nullable<string> = urlParameters.get('username');
  const token: Nullable<string> = urlParameters.get('token');
  const canVerifyEmail: boolean = urlParameters.has('username') && urlParameters.has('token');
  const canSendEmailBack: boolean = urlParameters.has('email');

  let verificationState: State<ServerError> = componentState();
  let sendBackState: State<ServerError> = componentState();

  function verifyEmail(): void {
    if (username && token) {
      verificationState.setLoading();
      Authentication.verifyEmail(username, token)
        .then(() => verificationState.setCustom('success'))
        .catch(verificationState.setError);
    }
  }

  function sendVerificationEmail(): void {
    if (!canSendEmailBack) {
      return;
    }
    if (email) {
      sendBackState.setLoading();
      Authentication.sendVerificationEmailBack(email)
        .then(() => sendBackState.setCustom('success'))
        .catch(sendBackState.setError);
    }
  }

  onMount(() => {
    if (canVerifyEmail) {
      verifyEmail();
    }
  });
</script>

<div class="page-padding center-content">
  <div class="w-full max-w-lg v-stack center-content padding-box space-y-4 text-center">
    <div class="w-10 h-10">
      <Icon type={IconType.email} />
    </div>

    {#if $verificationState.current === ComponentStateType.loading}
      <LoadingIndicator />
    {:else if $verificationState.current === ComponentStateType.error}
      <InfoMessage type={InfoMessageType.error}>
        <LocalizedServerError serverError={$verificationState.error} />
      </InfoMessage>
    {:else if $verificationState.current === 'success'}
      <div class="space-y-2">
        <h1 class="text-xl font-bold">{$_('page.verifyEmail.state.success.infoMessage')}</h1>
        <RoundedButton title="OK" on:click={() => Navigation.navigateTo('/')} />
      </div>
    {:else}
      <div class="space-y-2">
        <h1 class="text-xl font-bold">{$_('page.verifyEmail.title')}</h1>
        <h2 class="text-sm">{$_('page.verifyEmail.description')}</h2>
      </div>

      <div class="text-sm">
        <h3 class="text-secondary-text">{$_('page.verifyEmail.didntReceivedEmailDescription')}</h3>
        {#if $sendBackState.current === 'success'}
          <InfoMessage type={InfoMessageType.success}>
            {$_('page.verifyEmail.sendBackState.success.infoMessage')}
          </InfoMessage>
        {:else if $sendBackState.current === ComponentStateType.loading}
          <LoadingIndicator />
        {:else if $sendBackState.current === ComponentStateType.error}
          <InfoMessage type={InfoMessageType.error}>
            <LocalizedServerError serverError={$sendBackState.error} />
          </InfoMessage>
        {:else}
          <Button title={$_('page.verifyEmail.sendBackButton.title')} on:click={sendVerificationEmail} />
        {/if}
      </div>
    {/if}
  </div>
</div>
