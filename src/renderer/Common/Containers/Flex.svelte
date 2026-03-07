<script lang="ts">
  import type { Snippet } from "svelte";

  interface FlexProps {
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    der?: "row" | "column";
    justifyContent?: string;
    overflow?: string;
    justifyItems?: string;
    alignItems?: string;
    border?: string;
    tborder?: string;
    rborder?: string;
    bborder?: string;
    lborder?: string;
    bradius?: string;
    bgColor?: string;
    children?: Snippet;
  }

  let {
    width = "auto",
    height = "auto",
    padding = "0",
    margin = "0",
    der = "row",
    justifyContent = "auto",
    overflow = "auto",
    justifyItems = "auto",
    alignItems = "auto",
    border = "none",
    tborder = "none",
    rborder = "none",
    bborder = "none",
    lborder = "none",
    bradius = "none",
    bgColor = "transparent",
    children,
  }: FlexProps = $props();
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
  {@render children?.()}
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
