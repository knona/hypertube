<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { ServerError } from '../../../Models/Server/Errors/ServerError';
  import Authentication from '../../../Modules/Authentication/Authentication';
  import { componentState } from '../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../Modules/Store/ComponentState/Models/State';
  import Icon from '../../Components/Icon/Icon.svelte';
  import { IconType } from '../../Components/Icon/Models/IconType';
  import InfoMessage from '../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import RoundedButton from '../../Components/RoundedButton/RoundedButton.svelte';
  import TextField from '../../Components/TextField/TextField.svelte';

  let forgotPasswordState: State<ServerError> = componentState();
  let email: string = '';

  function sendResetPasswordEmail(): void {
    forgotPasswordState.setLoading();
    Authentication.sendResetPasswordEmail(email)
      .then(() => forgotPasswordState.setCustom('success'))
      .catch(forgotPasswordState.setError);
  }
</script>

<div class="page-padding center-content">
  <div class="w-full max-w-lg v-stack center-content padding-box space-y-4 text-center">
    <div class="w-10 h-10">
      <Icon type={IconType.key} />
    </div>
    {#if $forgotPasswordState.current === 'success'}
      <InfoMessage type={InfoMessageType.success}>
        {$_('page.forgotPassword.state.success.infoMessage')}
      </InfoMessage>
    {:else}
      <div>
        <h1 class="text-xl font-bold">{$_('page.forgotPassword.title')}</h1>
        <h2 class="text-sm">{$_('page.forgotPassword.description')}</h2>
      </div>
      {#if $forgotPasswordState.current === ComponentStateType.error}
        <InfoMessage type={InfoMessageType.error}>
          <LocalizedServerError serverError={$forgotPasswordState.error} />
        </InfoMessage>
      {/if}
      {#if $forgotPasswordState.current === ComponentStateType.loading}
        <LoadingIndicator />
      {:else}
        <form class="w-full max-w-xs v-stack justify-items-stretch space-y-2" on:submit={sendResetPasswordEmail}>
          <TextField placeholder={$_('page.forgotPassword.emailTextField.placeholder')} bind:text={email} />
          <div>
            <RoundedButton title={$_('page.forgotPassword.recoverButton.title')} on:click={sendResetPasswordEmail} />
          </div>
        </form>
      {/if}
    {/if}
  </div>
</div>
