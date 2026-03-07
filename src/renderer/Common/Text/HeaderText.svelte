<script lang="ts">
  import type { Snippet } from "svelte";

  interface HeaderTextProps {
    children?: Snippet;
  }

  let { children }: HeaderTextProps = $props();
</script>

<span>
  {@render children?.()}
</span>

<style>
  span {
    color: var(--fg-header);
  }
</style>
