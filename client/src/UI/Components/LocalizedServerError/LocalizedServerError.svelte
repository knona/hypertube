<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { ServerError } from '../../../Models/Server/Errors/ServerError';
  import type { Optional } from '../../../Shared/Types';

  export let serverError: Optional<ServerError>;

  function getErrorMessage(error: Optional<ServerError>): string {
    const subcode: Optional<string> = error?.extensions?.subCode;
    return !subcode ? 'errors.generic' : `errors.server.${subcode}`;
  }
</script>

{$_(getErrorMessage(serverError))}
