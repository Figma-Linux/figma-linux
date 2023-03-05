<script lang="ts">
  export let width = "auto";
  export let height = "auto";
  export let der: "row" | "column" = "row";
  export let align = "inherit";
  export let overflow = "inherit";
  export let justifyItems = "inherit";
</script>

<div
  style={`
    --align: ${align};
    --width: ${width};
    --height: ${height};
    --direction: ${der};
    --justify-items: ${justifyItems};
    --overflow: ${overflow};
  `}
>
  <slot />
</div>

<style>
  div {
    display: flex;
    flex-direction: var(--direction);
    justify-content: var(--align);
    justify-items: var(--justify-items);
    overflow: var(--overflow);
    align-items: var(--align);
    width: var(--width);
    height: var(--height);
  }
</style>
