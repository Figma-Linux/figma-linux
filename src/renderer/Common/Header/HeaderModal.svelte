<script lang="ts">
  import type { Snippet } from "svelte";

  interface HeaderModalProps {
    bgColor?: string;
    children?: Snippet;
  }

  let { bgColor = "var(--bg-header)", children }: HeaderModalProps = $props();
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
    padding-right: 20px;
    padding-left: 22px;
    border-bottom: 1px solid var(--borders);
  }
</style>
