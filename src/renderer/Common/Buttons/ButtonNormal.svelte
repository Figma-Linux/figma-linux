<script lang="ts">
  import Button from "./Button.svelte";

  export let normalFgColor = "var(--fg-header)";
  export let normalBgColor = "var(--bg-header)";
  export let activeBgColor = "var(--bg-tab-hover)";
  export let hoverBgColor = "var(--bg-tab-hover)";
  export let onClick = (event: MouseEvent) => {};
</script>

<Button {normalFgColor} {normalBgColor} {activeBgColor} {hoverBgColor} {onClick}>
  <slot />
</Button>
