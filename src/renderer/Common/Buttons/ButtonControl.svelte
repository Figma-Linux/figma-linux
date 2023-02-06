<script lang="ts">
  import Button from "./Button.svelte";

  export let onClick = (event: MouseEvent) => {};
</script>

<Button {onClick} class="button_control {$$props.class || ''}">
  <slot />
</Button>

<style>
  :global(.button_control) {
    padding: 0px 12px;
    color: var(--fg-header);
  }
</style>
