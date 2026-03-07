<script lang="ts">
  import type { Snippet } from "svelte";

  interface HeaderProps {
    bgColor?: string;
    children?: Snippet;
  }

  let { bgColor = "var(--bg-header)", children }: HeaderProps = $props();
</script>

<div
  style={`
    --bg-color: ${bgColor};
  `}
>
  {@render children?.()}
</div>

<style>
  div {
    display: flex;
    align-items: center;
    background-color: var(--bg-color);
  }
</style>
