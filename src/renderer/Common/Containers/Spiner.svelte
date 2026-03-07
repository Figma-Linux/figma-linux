<script lang="ts">
  import type { Snippet } from "svelte";

  interface SpinerProps {
    spin?: boolean;
    children?: Snippet;
  }

  let { spin = false, children }: SpinerProps = $props();
</script>

<div class={spin ? "spin" : ""}>
  {@render children?.()}
</div>

<style>
  div {
    display: flex;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .spin {
    animation-name: spin;
    animation-duration: 1000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
</style>
