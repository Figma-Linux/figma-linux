<script lang="ts">
  import type { Snippet } from "svelte";

  interface TextInputProps {
    value?: string;
    width?: string;
    placeholder?: string;
    isValidValue?: boolean;
    validator?: (value: string) => boolean;
    onchange?: (value: string) => void;
    children?: Snippet;
  }

  let {
    value = $bindable(""),
    width = "auto",
    placeholder = "",
    isValidValue = $bindable(true),
    validator = () => true,
    onchange,
    children,
  }: TextInputProps = $props();

  function onChangeHandler() {
    isValidValue = validator(value);
    onchange?.(value);
  }
</script>

<div class={`${!isValidValue ? "input_error" : ""}`}>
  {@render children?.()}
  <input
    bind:value
    style={`
      --inputWidth: ${width};
    `}
    type="text"
    {placeholder}
    onchange={onChangeHandler}
    onfocusout={onChangeHandler}
  />
</div>

<style>
  div {
    display: flex;
    border: 1px solid var(--borders);
    border-radius: 3px;
    padding: 8px;
    width: var(--inputWidth);
  }
  .input_error {
    border: 1px solid var(--bg-window-close);
  }
  input {
    background-color: transparent;
    outline: none;
    color: var(--text);
    border: 0;
    margin-left: 6px;
    width: 100%;
  }

  input:hover,
  input:active,
  input:focus {
    background-color: transparent;
    outline: none;
    border: 0;
  }
</style>
