<script lang="ts">
  import ButtonControlHover from "./ButtonControlHover.svelte";

  export let onClick = (event: MouseEvent) => {};
</script>

<ButtonControlHover {onClick} class="button_tabclose">
  <slot />
</ButtonControlHover>

<style>
  :global(.button_tabclose) {
    padding: 0px 8px;
  }
</style>
