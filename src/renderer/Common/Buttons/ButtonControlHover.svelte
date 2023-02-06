<script lang="ts">
  import ButtonControl from "./ButtonControl.svelte";

  export let onClick = (event: MouseEvent) => {};
</script>

<ButtonControl {onClick} class="button_control2 {$$props.class || ''}">
  <slot />
</ButtonControl>

<style>
  :global(.button_control2) {
    padding: 0px 12px;
    color: var(--fg-header);
    opacity: 0.4;
    transition: all 0.1s ease;
  }
  :global(.button_control2):hover {
    opacity: 1;
  }
</style>
