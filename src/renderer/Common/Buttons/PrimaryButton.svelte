<script lang="ts">
  import Button from "./Button.svelte";

  export let width = "inherit";
  export let height = "36px";
  export let margin = "inherit";
  export let padding = "0 7px";

  export let normalFgColor = "var(--fg-toolbar-active)";
  export let normalBgColor = "var(--bg-toolbar-active)";
  export let activeBgColor = "var(--bg-toolbar-active"; // --color-bg-brand-pressed: #0a6dc2
  export let hoverBgColor = "var(--bg-toolbar-active)";
  export let isActive = false;

  export let normalBorder = "none";
  export let activeBorder = "none";
  export let hoverBorder = "none";

  export let normalCursor = "pointer";
  export let activeCursor = "pointer";
  export let hoverCursor = "pointer";
</script>

<Button
  {width}
  {height}
  {margin}
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
  on:buttonClick
>
  <slot />
</Button>
