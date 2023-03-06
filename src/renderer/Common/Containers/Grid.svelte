<script lang="ts">
  export let gap = "";

  export let width = "auto";
  export let height = "auto";
  export let columns = "auto";
  export let rows = "auto";
  export let columnGap = "auto";
  export let rowGap = "auto";
  export let areas = "auto";

  if (gap) {
    rowGap = gap;
    columnGap = gap;
  }
</script>

<div
  style={`
    --width: ${width};
    --height: ${height};
    --columns: ${columns};
    --rows: ${rows};
    --areas: ${areas};
    --grid-column-gap: ${columnGap};
    --grid-row-gap: ${rowGap};
  `}
>
  <slot />
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
  }
</style>
