<script lang="ts">
  import type { Optional } from '../../../Shared/Types';
  import { imageUrl } from '../../../Utils/ImageUtils';
  import Icon from '../Icon/Icon.svelte';
  import { IconType } from '../Icon/Models/IconType';
  import OptionalImage from '../OptionalImage/OptionalImage.svelte';

  export let pictureUrl: Optional<string>;
</script>

<div class="rounded-full overflow-hidden">
  <OptionalImage src={pictureUrl && imageUrl(pictureUrl)}>
    <div class="p-4 bg-secondary-bg">
      <Icon type={IconType.user} />
    </div>
  </OptionalImage>
</div>
