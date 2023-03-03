<script lang="ts">
  import Button from "./Button.svelte";

  export let padding = "0 7px";
  export let normalFgColor = "var(--text)";
  export let normalBgColor = "transparent";
  export let activeBgColor = "transparent";
  export let hoverBgColor = "transparent";
  export let isActive = false;

  export let normalBorder = "1px solid var(--text)";
  export let activeBorder = "1px solid var(--text)";
  export let hoverBorder = "1px solid var(--text)";

  export let normalCursor = "pointer";
  export let activeCursor = "pointer";
  export let hoverCursor = "pointer";
</script>

<Button
  {padding}
  {normalFgColor}
  {normalBgColor}
  {activeBgColor}
  {hoverBgColor}
  {isActive}
  {normalBorder}
  {activeBorder}
  {hoverBorder}
  {normalCursor}
  {activeCursor}
  {hoverCursor}
  round={3}
  height="36px"
  on:mousedown
  on:mouseup
>
  <slot />
</Button>
