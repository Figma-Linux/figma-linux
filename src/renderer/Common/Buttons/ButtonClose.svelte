<script lang="ts">
  import ButtonWinControl from "./ButtonWinControl.svelte";

  export let normalFgColor = "var(--fg-header)";
  export let normalBgColor = "var(--bg-header-control)";
  export let activeBgColor = "var(--bg-tab-hover)";
  export let hoverBgColor = "var(--bg-window-close)";
  export let onClick = (event: MouseEvent) => {};
</script>

<ButtonWinControl {normalFgColor} {normalBgColor} {activeBgColor} {hoverBgColor} {onClick}>
  <slot />
</ButtonWinControl>
