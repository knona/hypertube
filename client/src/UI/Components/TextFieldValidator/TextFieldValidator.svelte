<script lang="ts">
  import { BehaviorSubject, Subject } from 'rxjs';
  import { debounceTime, filter, map, skip, takeUntil, tap } from 'rxjs/operators';
  import { onDestroy } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { Optional, Validator } from '../../../Shared/Types';
  import { TextFieldType } from '../TextField/Models/TextFieldType';
  import TextField from '../TextField/TextField.svelte';
  import type { ValidatorError } from './Models/ValidatorError';

  export let text: string;
  export let placeholder: string = '';
  export let type: TextFieldType = TextFieldType.default;
  export let validator: Validator;
  export let isValid: boolean;

  const destroy$: Subject<void> = new Subject();
  const textBehavior: BehaviorSubject<string> = new BehaviorSubject(text);
  let errorType: Optional<ValidatorError> = undefined;

  function fieldError(stringValue: string): Optional<ValidatorError> {
    try {
      validator(stringValue);
    } catch (error) {
      return error as ValidatorError;
    }
  }

  textBehavior
    .pipe(
      filter(stringValue => !!stringValue),
      skip(2),
      map(fieldError),
      tap(error => (isValid = error === undefined)),
      debounceTime(500),
      tap(error => (errorType = error)),
      takeUntil(destroy$)
    )
    .subscribe();

  $: textBehavior.next(text);

  onDestroy(() => {
    destroy$.next();
    destroy$.complete();
  });
</script>

<div class="v-stack items-stretch space-y-1">
  <TextField {placeholder} {type} bind:text />

  {#if errorType}
    <h5 class="flex-1 text-left text-sm text-red-500">{$_(`errors.validator.${errorType ?? ''}`)}</h5>
  {/if}
</div>
