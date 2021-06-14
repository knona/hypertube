<script lang="ts">
  import { TextFieldType } from './Models/TextFieldType';

  export let text: string;
  export let placeholder: string = '';
  export let type: TextFieldType = TextFieldType.default;
  export let required: boolean = true;

  function textDidChange(event: Event): void {
    text = (event.target as HTMLInputElement).value;
  }
</script>

<input
  class="px-3 py-1.5 flex-1 text-sm appearance-none bg-fill border-none rounded-lg"
  {type}
  {placeholder}
  value={text}
  {required}
  on:input={textDidChange}
/>
