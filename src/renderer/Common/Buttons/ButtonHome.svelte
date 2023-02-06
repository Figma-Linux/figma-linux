<script lang="ts">
  import Button from "./Button.svelte";

  export let onClick = (event: MouseEvent) => {};
</script>

<Button {onClick} class="button_control_home">
  <slot />
</Button>

<style>
  :global(.button_control_home) {
    padding: 0px 10px;
  }
</style>
