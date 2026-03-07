<script lang="ts">
  interface RangeProps {
    value?: number;
    readonly?: boolean;
    max?: number;
    min?: number;
    step?: number;
    width?: string;
    thumbSize?: string;
    trackSize?: string;
    onchange?: (event: Event) => void;
  }

  let {
    value = $bindable(0),
    readonly = false,
    max = 100,
    min = 0,
    step = 1,
    width = "auto",
    thumbSize = "16px",
    trackSize = "2px",
    onchange,
  }: RangeProps = $props();
</script>

<input
  style={`
    --inputWidth: ${width};
    --thumbSize: ${thumbSize};
    --trackSize: ${trackSize};
  `}
  type="range"
  {readonly}
  {min}
  {max}
  {step}
  bind:value
  onchange={onchange}
/>

<style>
  input {
    background-color: transparent;
    -webkit-appearance: none;
    appearance: none;
    height: var(--thumbSize);
    margin: 0;
    padding: 0;
    border: 0;
    width: var(--inputWidth);
  }

  input::-webkit-slider-runnable-track {
    background: var(--text);
    height: var(--trackSize);
    border-radius: calc(var(--trackSize) / 2);
  }

  input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    border: 1 solid var(--text);
    background: var(--text);
    width: var(--thumbSize);
    height: var(--thumbSize);
    border-radius: calc(var(--thumbSize));
    margin-top: calc(((var(--thumbSize) - var(--trackSize)) / 2) * -1);
  }

  input:hover::-webkit-slider-thumb {
    cursor: pointer;
  }

  input:hover::-webkit-slider-runnable-track {
    cursor: pointer;
  }
</style>
