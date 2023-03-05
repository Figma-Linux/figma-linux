<script lang="ts">
  export let width = "auto";
  export let height = "auto";
  export let columns = "auto";
  export let rows = "auto";
  export let areas = "auto";
</script>

<div
  style={`
    --width: ${width};
    --height: ${height};
    --columns: ${columns};
    --rows: ${rows};
    --areas: ${areas};
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
    width: var(--width);
    height: var(--height);
  }
</style>
