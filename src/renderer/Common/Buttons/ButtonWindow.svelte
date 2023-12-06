<script lang="ts">
  import Button from "./Button.svelte";

  export let padding = "0.5rem 1rem";
  export let normalBgColor = "var(--bg-header-control)";
  export let activeBgColor = "var(--bg-header-control-hover)";
  export let hoverBgColor = "var(--bg-header-control-hover)";
  export let isActive = false;
</script>

<Button {padding} {normalBgColor} {activeBgColor} {hoverBgColor} {isActive} on:buttonClick>
  <slot />
</Button>
