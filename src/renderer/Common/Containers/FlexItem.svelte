<script lang="ts">
  import type { Snippet } from "svelte";

  interface FlexItemProps {
    grow?: number;
    flex?: number;
    children?: Snippet;
  }

  let { grow = 0, flex = 0, children }: FlexItemProps = $props();
</script>

<div
  style={`
    flex: ${flex};
    flex-grow: ${grow};
  `}
>
  {@render children?.()}
</div>
