<script lang="ts">
  import type { Snippet } from "svelte";

  interface LineProps {
    width?: string;
    height?: string;
    type?: "H" | "V";
    children?: Snippet;
  }

  let {
    width = undefined,
    height = undefined,
    type = "H",
    children,
  }: LineProps = $props();

  let effectiveWidth = $derived(type === "H" ? (width ?? "100%") : width);
  let effectiveHeight = $derived(type === "V" ? (height ?? "100%") : height);
</script>

<div
  style={`
    --width: ${effectiveWidth};
    --height: ${effectiveHeight};
  `}
>
  {@render children?.()}
</div>

<style>
  div {
    border: 1px solid var(--borders);
    width: var(--width);
    height: var(--height);
  }
</style>
