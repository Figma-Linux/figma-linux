<script lang="ts">
  import Button from "./Button.svelte";

  export let normalFgColor = "var(--fg-header)";
  export let normalBgColor = "var(--bg-header)";
  export let activeBgColor = "var(--bg-tab-hover)";
  export let hoverBgColor = "var(--bg-tab-hover)";
  export let isActive = false;
  export let onClick = (event: MouseEvent) => {};
</script>

<Button
  {normalFgColor}
  {normalBgColor}
  {activeBgColor}
  {hoverBgColor}
  {isActive}
  {onClick}
  class="button_control {$$props.class || ''}"
>
  <slot />
</Button>

<style>
  :global(.button_control) {
    padding: 0px 12px;
  }
</style>
