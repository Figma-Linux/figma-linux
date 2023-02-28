<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let title: string;
  export let height: number;
  export let open = false;
  export let duration = 400;

  const bodyHeight = tweened(0, {
    duration,
    easing: cubicOut,
  });

  if (open) {
    bodyHeight.set(height);
  }

  function onChange(event: Event) {
    const elem = event.target as HTMLInputElement;

    if (elem.checked) {
      bodyHeight.set(height);
    } else {
      bodyHeight.set(0);
    }
  }
</script>

<div>
  <label>
    <input type="checkbox" bind:checked={open} on:change={onChange} />
    <span>{title}</span>
  </label>
  <block
    style={`
      height: ${$bodyHeight}px;
    `}
  >
    <slot />
  </block>
</div>

<style>
  div {
    width: -webkit-fill-available;
  }
  label {
    display: flex;
    align-items: center;
    width: -webkit-fill-available;
    user-select: none;
  }
  span {
    position: relative;
    width: -webkit-fill-available;
    border-bottom: 1px solid var(--borders);
    padding-left: 24px;
    color: var(--text);
  }

  block {
    display: flex;
    align-items: baseline;
    gap: 12px;
    width: -webkit-fill-available;
    overflow: hidden;
    overflow-y: auto;
    flex-wrap: wrap;
    align-content: baseline;
  }
  block::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: transparent;
  }
  block::-webkit-scrollbar-corner {
    display: none;
  }
  block::-webkit-scrollbar-thumb {
    background: var(--color-scrollbar, rgba(179, 179, 179, 0.5));
    border-radius: 10px;
  }

  input {
    display: none;
  }
  input ~ span::before {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 8px;
    height: 8px;
    border-bottom: 2px solid var(--borders);
    border-right: 2px solid var(--borders);
    transform: rotate(-45deg);
    transition: all 0.1s ease;
  }
  input:checked ~ span::before {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 8px;
    height: 8px;
    border-bottom: 2px solid var(--borders);
    border-right: 2px solid var(--borders);
    transform: rotate(45deg);
    transition: all 0.1s ease;
  }
</style>
