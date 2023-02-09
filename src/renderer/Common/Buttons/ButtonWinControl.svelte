<script lang="ts">
  import ButtonControl from "./ButtonControl.svelte";

  export let normalBgColor = "var(--bg-header-control)";
  export let activeBgColor = "var(--bg-header-control-hover)";
  export let hoverBgColor = "var(--bg-header-control-hover)";
  export let isActive = false;
  export let onClick = (event: MouseEvent) => {};
</script>

<ButtonControl
  {normalBgColor}
  {activeBgColor}
  {hoverBgColor}
  {isActive}
  {onClick}
  class="button_win_control {$$props.class || ''}"
>
  <slot />
</ButtonControl>

<style>
  :global(.button_win_control) {
    padding: 0px 18px;
    transition: all 0.08s ease;
  }
</style>
