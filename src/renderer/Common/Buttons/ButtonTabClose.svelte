<script lang="ts">
  import ButtonControlHover from "./ButtonControlHover.svelte";

  export let normalFgColor = "var(--fg-header)";
  export let normalBgColor = "var(--bg-header)";
  export let activeBgColor = "var(--bg-tab-hover)";
  export let hoverBgColor = "var(--bg-tab-hover)";
  export let onClick = (event: MouseEvent) => {};
</script>

<ButtonControlHover
  {normalFgColor}
  {normalBgColor}
  {activeBgColor}
  {hoverBgColor}
  {onClick}
  class="button_tabclose"
>
  <slot />
</ButtonControlHover>

<style>
  :global(.button_tabclose) {
    padding: 0px 8px;
  }
</style>
