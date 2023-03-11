<script lang="ts">
  export let width = "auto";
  export let height = "auto";
  export let padding = "0";
  export let margin = "0";
  export let der: "row" | "column" = "row";
  export let justifyContent = "auto";
  export let overflow = "auto";
  export let justifyItems = "auto";
  export let alignItems = "auto";
  export let border = "none";
  export let tborder = "none";
  export let rborder = "none";
  export let bborder = "none";
  export let lborder = "none";
  export let bradius = "none";
  export let bgColor = "transparent";
</script>

<div
  style={`
    --width: ${width};
    --height: ${height};
    --direction: ${der};
    --justifyItems: ${justifyItems};
    --justifyContent: ${justifyContent};
    --alignItems: ${alignItems};
    --overflow: ${overflow};
    --border: ${border};
    --tborder: ${tborder};
    --rborder: ${rborder};
    --bborder: ${bborder};
    --lborder: ${lborder};
    --bradius: ${bradius};
    --padding: ${padding};
    --margin: ${margin};
    --bgColor: ${bgColor};
  `}
>
  <slot />
</div>

<style>
  div {
    display: flex;
    flex-direction: var(--direction);
    justify-content: var(--justifyContent);
    justify-items: var(--justifyItems);
    overflow: var(--overflow);
    border: var(--border);
    border-top: var(--tborder);
    border-right: var(--rborder);
    border-bottom: var(--bborder);
    border-left: var(--lborder);
    border-radius: var(--bradius);
    align-items: var(--alignItems);
    width: var(--width);
    height: var(--height);
    padding: var(--padding);
    margin: var(--margin);
    background-color: var(--bgColor);
  }
</style>
