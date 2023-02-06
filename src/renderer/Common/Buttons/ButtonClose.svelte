<script lang="ts">
  import ButtonWinControl from "./ButtonWinControl.svelte";

  export let onClick = (event: MouseEvent) => {};
</script>

<ButtonWinControl {onClick} class="button_win_close">
  <slot />
</ButtonWinControl>

<style>
  :global(.button_win_close):hover {
    background-color: var(--bg-window-close);
  }
</style>
