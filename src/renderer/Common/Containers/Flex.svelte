<script lang="ts">
  export let width = "auto";
  export let height = "auto";
  export let der: "row" | "column" = "row";
  export let align = "inherit";
</script>

<div
  style={`
    --align: ${align};
    --width: ${width};
    --height: ${height};
    --direction: ${der};
  `}
>
  <slot />
</div>

<style>
  div {
    display: flex;
    flex-direction: var(--direction);
    justify-content: var(--align);
    align-items: var(--align);
    width: var(--width);
    height: var(--height);
  }
</style>
