<script lang="ts">
  import type { User } from '../../../../Models/User';
  import { imageUrl } from '../../../../Utils/ImageUtils';
  import UserPicture from '../../../Components/UserPicture/UserPicture.svelte';

  export let user: User;
</script>

<div class="relative w-full h-80 md:h-72 bg-secondary-bg">
  <img class="w-full h-full object-cover" src={imageUrl(user.pictureUrl ?? '')} alt="User Profile" />
  <div class="absolute top-0 left-0 right-0 bottom-0 backdrop-filter backdrop-blur-xl" />

  <div class="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-bg to-transparent">
    <div class="page-padding">
      <div
        class="max-width flex flex-col items-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
      >
        <div class="flex flex-col items-start space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <div class="group relative w-16 h-16 rounded-full border-white border-4 bg-secondary-bg overflow-hidden">
            <UserPicture pictureUrl={user.pictureUrl} />
          </div>

          <div class="v-stack items-start">
            <div class="text-xl font-semibold">{user.firstName} {user.lastName}</div>
            <div class="text-secondary-text">{user.username}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
