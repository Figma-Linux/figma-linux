<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "./Button.svelte";

  interface SecondaryButtonProps {
    padding?: string;
    width?: string;
    height?: string;
    normalFgColor?: string;
    hoverFgColor?: string;
    normalBgColor?: string;
    activeBgColor?: string;
    hoverBgColor?: string;
    isActive?: boolean;
    normalBorder?: string;
    activeBorder?: string;
    hoverBorder?: string;
    normalCursor?: string;
    activeCursor?: string;
    hoverCursor?: string;
    onClick?: (event: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    padding = "0 7px",
    width = "auto",
    height = "36px",
    normalFgColor = "var(--text)",
    hoverFgColor = "var(--text-active)",
    normalBgColor = "transparent",
    activeBgColor = "transparent",
    hoverBgColor = "transparent",
    isActive = false,
    normalBorder = "1px solid var(--text)",
    activeBorder = "1px solid var(--text-active)",
    hoverBorder = "1px solid var(--text-active)",
    normalCursor = "pointer",
    activeCursor = "pointer",
    hoverCursor = "pointer",
    onClick,
    children,
  }: SecondaryButtonProps = $props();
</script>

<Button
  {padding}
  {width}
  {height}
  {normalFgColor}
  {hoverFgColor}
  {normalBgColor}
  {activeBgColor}
  {hoverBgColor}
  {isActive}
  {normalBorder}
  {activeBorder}
  {hoverBorder}
  {normalCursor}
  {activeCursor}
  {hoverCursor}
  {onClick}
  round={3}
>
  {@render children?.()}
</Button>
