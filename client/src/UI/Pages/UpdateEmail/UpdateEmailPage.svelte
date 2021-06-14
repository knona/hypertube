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
  import Icon from '../../Components/Icon/Icon.svelte';
  import { IconType } from '../../Components/Icon/Models/IconType';
  import InfoMessage from '../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../Components/LocalizedServerError/LocalizedServerError.svelte';

  const urlParameters: URLSearchParams = new URLSearchParams(window.location.search);
  const username: Nullable<string> = urlParameters.get('username');
  const token: Nullable<string> = urlParameters.get('token');
  const canResetEmail: boolean = urlParameters.has('username') && urlParameters.has('token');

  let resetState: State<ServerError> = componentState();

  function resetEmail(): void {
    resetState.setLoading();
    Authentication.updateEmail(username ?? '', token ?? '')
      .then(() => Navigation.navigateTo('/profile'))
      .catch(resetState.setError);
  }

  onMount(() => {
    if (canResetEmail) {
      resetEmail();
    } else {
      Navigation.navigateTo('/');
    }
  });
</script>

<div class="page-padding center-content">
  <div class="w-full max-w-lg v-stack center-content padding-box space-y-4 text-center">
    <div class="w-10 h-10">
      <Icon type={IconType.email} />
    </div>
    <div>
      <h1 class="text-xl font-bold">{$_('page.updateEmail.title')}</h1>
    </div>
    {#if $resetState.current === ComponentStateType.loading}
      <LoadingIndicator />
    {:else if $resetState.current === ComponentStateType.error}
      <InfoMessage type={InfoMessageType.error}>
        <LocalizedServerError serverError={$resetState.error} />
      </InfoMessage>
    {/if}
  </div>
</div>
