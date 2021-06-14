<script lang="ts">
  import { _ } from 'svelte-i18n';

  import type { ServerError } from '../../../../Models/Server/Errors/ServerError';
  import Authentication from '../../../../Modules/Authentication/Authentication';
  import Navigation from '../../../../Modules/Navigation/Navigation';
  import { componentState } from '../../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../../Modules/Store/ComponentState/Models/State';
  import { currentUserStore } from '../../../../Modules/Store/CurrentUser/CurrentUserStore';
  import UserEdition from '../../../../Modules/UserEdition/UserEdition';
  import { imageUrl } from '../../../../Utils/ImageUtils';
  import Icon from '../../../Components/Icon/Icon.svelte';
  import { IconType } from '../../../Components/Icon/Models/IconType';
  import InfoMessage from '../../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';

  let uploadState: State<ServerError> = componentState();
  let fileInput: HTMLInputElement;

  function updateProfilePicture(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    if (input.files) {
      if (input.files.length === 0) {
        return;
      }
      const image: File = input.files[0];
      uploadState.setLoading();
      UserEdition.updateProfilePicture(image)
        .then(() => uploadState.setDefault())
        .catch(uploadState.setError);
    }
  }

  function clickFileInput(): void {
    fileInput.click();
  }

  function logout(): void {
    Authentication.logout();
    Navigation.navigateTo('/');
  }
</script>

<div class="relative w-full h-80 md:h-72 bg-secondary-bg">
  <img class="w-full h-full object-cover" src={imageUrl($currentUserStore.user?.pictureUrl ?? '')} alt="User Profile" />
  <div class="absolute top-0 left-0 right-0 bottom-0 backdrop-filter backdrop-blur-xl" />

  <div class="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-bg to-transparent">
    <div class="page-padding">
      <div
        class="max-width flex flex-col items-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
      >
        <div class="flex flex-col items-start space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <div class="group relative w-16 h-16 rounded-full border-white border-4 bg-secondary-bg overflow-hidden">
            {#if $currentUserStore.user?.pictureUrl}
              <img src={imageUrl($currentUserStore.user.pictureUrl)} alt="User Profile" />

              {#if $uploadState.current === ComponentStateType.loading}
                <div class="absolute top-0 left-0 right-0 bottom-0 z-20 v-stack center-content bg-black bg-opacity-50">
                  <LoadingIndicator showText={false} />
                </div>
              {:else}
                <button
                  class="z-10 appearance-none border-none bg-transparent transition-opacity opacity-0 group-hover:opacity-100"
                  on:click={clickFileInput}
                >
                  <div class="absolute top-0 left-0 right-0 bottom-0 v-stack center-content bg-black bg-opacity-50">
                    <div class="w-5 h-5">
                      <Icon type={IconType.camera} />
                    </div>
                  </div>
                </button>
              {/if}
            {:else}
              <button class="w-full h-full p-4 appearance-none border-none bg-transparent" on:click={clickFileInput}>
                <Icon type={IconType.camera} />
              </button>
            {/if}
          </div>

          <div class="v-stack items-start">
            <div class="text-xl font-semibold">
              {$currentUserStore.user?.firstName ?? ''}
              {$currentUserStore.user?.lastName ?? ''}
            </div>
            <div class="text-secondary-text">{$currentUserStore.user?.username ?? ''}</div>
            {#if $uploadState.current === ComponentStateType.error}
              <InfoMessage type={InfoMessageType.error}>
                <LocalizedServerError serverError={$uploadState.error} />
              </InfoMessage>
            {/if}
          </div>
        </div>

        <RoundedButton
          title={$_('page.currentUser.components.editionProfilePicture.logoutButton.title')}
          on:click={logout}
        />
      </div>
    </div>
  </div>

  <input class="hidden" type="file" accept=".jpg, .jpeg, .png" bind:this={fileInput} on:change={updateProfilePicture} />
</div>
