<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let size: number | undefined = undefined;
  export let value: string;

  export let key = "";
  export let width = "auto";
  export let height = "auto";

  if (size) {
    width = `${size}px`;
    height = `${size}px`;
  }

  function onMouseDownHandler(event: MouseEvent) {
    dispatch("mouseClick", { input: event.target, button: event.button, value, key });
  }
</script>

<input
  bind:value
  type="color"
  style={`
    --inputWidth: ${width};
    --inputHeight: ${height};
  `}
  on:change
  on:mousedown={onMouseDownHandler}
/>

<style>
  input {
    width: var(--inputWidth);
    height: var(--inputHeight);
    background-color: transparent;
    border: none;
    outline: none;
    margin: 0;
    padding: 0;
  }

  input::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input::-webkit-color-swatch {
    /* border: 1px solid var(--borders); */
    border: 0;
    border-radius: 3px;
  }

  input:focus,
  input:active {
    background-color: transparent;
  }
</style>
