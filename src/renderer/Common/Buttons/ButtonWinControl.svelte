<script lang="ts">
  import ButtonControl from "./ButtonControl.svelte";

  export let onClick = (event: MouseEvent) => {};
</script>

<ButtonControl {onClick} class="button_win_control {$$props.class || ''}">
  <slot />
</ButtonControl>

<style>
  :global(.button_win_control) {
    padding: 0px 18px;
    background-color: var(--bg-header-control);
    transition: all 0.08s ease;
  }
  :global(.button_win_control):hover {
    background-color: var(--bg-header-control-hover);
  }
</style>
