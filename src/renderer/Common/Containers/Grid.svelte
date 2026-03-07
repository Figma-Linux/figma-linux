<script lang="ts">
  import type { Snippet } from "svelte";

  interface GridProps {
    gap?: string;
    width?: string;
    height?: string;
    padding?: string;
    columns?: string;
    rows?: string;
    columnGap?: string;
    rowGap?: string;
    areas?: string;
    children?: Snippet;
  }

  let {
    gap = "",
    width = "auto",
    height = "auto",
    padding = "inherit",
    columns = "auto",
    rows = "auto",
    columnGap = "auto",
    rowGap = "auto",
    areas = "auto",
    children,
  }: GridProps = $props();

  let effectiveColumnGap = $derived(gap ? gap : columnGap);
  let effectiveRowGap = $derived(gap ? gap : rowGap);
</script>

<div
  style={`
    --width: ${width};
    --height: ${height};
    --padding: ${padding};
    --columns: ${columns};
    --rows: ${rows};
    --areas: ${areas};
    --grid-column-gap: ${effectiveColumnGap};
    --grid-row-gap: ${effectiveRowGap};
  `}
>
  {@render children?.()}
</div>

<style>
  div {
    display: grid;
    grid-template-columns: var(--columns);
    grid-template-rows: var(--rows);
    grid-template-areas: var(--areas);
    grid-column-gap: var(--grid-column-gap);
    grid-row-gap: var(--grid-row-gap);
    width: var(--width);
    height: var(--height);
    padding: var(--padding);
  }
</style>
