<script lang="ts">
  import { _ } from 'svelte-i18n';

  import type { ServerError } from '../../../Models/Server/Errors/ServerError';
  import Authentication from '../../../Modules/Authentication/Authentication';
  import Navigation from '../../../Modules/Navigation/Navigation';
  import { componentState } from '../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../Modules/Store/ComponentState/Models/State';
  import type { Nullable } from '../../../Shared/Types';
  import Box from '../../Components/Box/Box.svelte';
  import Icon from '../../Components/Icon/Icon.svelte';
  import { IconType } from '../../Components/Icon/Models/IconType';
  import InfoMessage from '../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import RoundedButton from '../../Components/RoundedButton/RoundedButton.svelte';

  const urlParameters: URLSearchParams = new URLSearchParams(window.location.search);
  const code: Nullable<string> = urlParameters.get('code');
  let state: State<ServerError> = componentState({ current: ComponentStateType.loading });

  function authenticate(authCode: string): void {
    state.setLoading();
    Authentication.loginWith42(authCode)
      .then(() => {
        state.setCustom('success');
        Navigation.navigateTo('/');
      })
      .catch(state.setError);
  }

  function goToAuthentication(): void {
    Navigation.navigateTo('/');
  }

  $: {
    if (code) {
      authenticate(code);
    } else {
      goToAuthentication();
    }
  }
</script>

<div class="page-padding v-stack items-center">
  <div id="box-container" class="w-full">
    <Box>
      <div class="v-stack items-center space-y-2">
        <div class="w-10 h-10">
          <Icon type={IconType.ft} />
        </div>

        {#if $state.current === ComponentStateType.loading}
          <LoadingIndicator />
        {:else if $state.current === ComponentStateType.error}
          <div class="v-stack items-center space-y-2">
            <InfoMessage type={InfoMessageType.error}>
              <LocalizedServerError serverError={$state.error} />
            </InfoMessage>
            <RoundedButton title={$_('page.ftAuthentication.retryButton.title')} on:click={goToAuthentication} />
          </div>
        {/if}
      </div>
    </Box>
  </div>
</div>

<style>
  #box-container {
    max-width: 450px;
  }
</style>
