<script lang="ts">
  export let value: number;

  export let readonly = false;
  export let max = 0;
  export let min = 100;
  export let step = 1;

  export let width = "auto";
  export let thumbSize = "16px";
  export let trackSize = "2px";
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
  on:change
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
