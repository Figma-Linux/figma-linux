<script lang="ts">
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let title: string;
  export let isEmpty = false;
  export let open = false;
  export let duration = 400;

  let height = 0;
  let content: HTMLDivElement;
  const bodyHeight = tweened(0, {
    duration,
    easing: cubicOut,
  });

  function calcHeight() {
    if (!content) {
      return;
    }

    const bounds = content.getBoundingClientRect();

    if (!isEmpty) {
      height = bounds.height;
    }

    if (open) {
      bodyHeight.set(height);
    }
  }
  function onChange(event: Event) {
    const elem = event.target as HTMLInputElement;

    if (elem.checked) {
      bodyHeight.set(height);
    } else {
      bodyHeight.set(0);
    }
  }

  onMount(calcHeight);

  window.addEventListener("resize", calcHeight);
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
    <blockContent bind:this={content}>
      <slot />
    </blockContent>
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

  blockContent {
    display: block;
  }
  block {
    display: block;
    width: -webkit-fill-available;
    overflow: hidden;
  }

  input {
    display: none;
  }
  input ~ span::before {
    content: "";
    position: absolute;
    top: 6px;
    left: 6px;
    width: 0;
    height: 0;
    border-top: 5px solid var(--borders);
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    transform: rotate(-90deg);
    transition: all 0.1s ease;
  }
  input:checked ~ span::before {
    content: "";
    position: absolute;
    top: 6px;
    left: 6px;
    width: 0;
    height: 0;
    border-top: 5px solid var(--borders);
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    transform: rotate(0deg);
    transition: all 0.1s ease;
  }
</style>
