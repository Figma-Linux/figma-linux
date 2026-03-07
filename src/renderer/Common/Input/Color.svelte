<script lang="ts">
  interface ColorClickEvent {
    input: EventTarget | null;
    button: number;
    value: string;
    key: string;
  }

  interface ColorProps {
    size?: number;
    value?: string;
    key?: string;
    width?: string;
    height?: string;
    onchange?: (event: Event) => void;
    onColorClick?: (event: ColorClickEvent) => void;
  }

  let {
    size = undefined,
    value = $bindable("#000000"),
    key = "",
    width = "auto",
    height = "auto",
    onchange,
    onColorClick,
  }: ColorProps = $props();

  let effectiveWidth = $derived(size ? `${size}px` : width);
  let effectiveHeight = $derived(size ? `${size}px` : height);

  function onMouseDownHandler(event: MouseEvent) {
    onColorClick?.({ input: event.target, button: event.button, value, key });
  }
</script>

<input
  bind:value
  type="color"
  style={`
    --inputWidth: ${effectiveWidth};
    --inputHeight: ${effectiveHeight};
  `}
  onchange={onchange}
  onmousedown={onMouseDownHandler}
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
