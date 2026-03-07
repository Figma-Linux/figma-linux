<script lang="ts">
  import type { Snippet } from "svelte";

  interface RotateProps {
    deg?: number;
    children?: Snippet;
  }

  let { deg = 0, children }: RotateProps = $props();
</script>

<div
  style={`
    --deg: ${deg}deg;
  `}
>
  {@render children?.()}
</div>

<style>
  div {
    display: flex;
    transform: rotate(var(--deg));
  }
</style>
