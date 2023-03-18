<script lang="ts">
  export let value: string;

  export let width = "auto";
  export let placeholder = "";
  export let isValidValue = true;
  export let validator = (value: string) => true;

  function onChangeHandler() {
    isValidValue = validator(value);
  }
</script>

<div class={`${!isValidValue ? "input_error" : ""}`}>
  <slot />
  <input
    bind:value
    style={`
      --inputWidth: ${width};
    `}
    type="text"
    {placeholder}
    on:change={onChangeHandler}
    on:focusout={onChangeHandler}
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
