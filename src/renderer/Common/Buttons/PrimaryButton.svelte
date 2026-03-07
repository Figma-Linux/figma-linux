<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "./Button.svelte";

  interface PrimaryButtonProps {
    width?: string;
    height?: string;
    margin?: string;
    padding?: string;
    normalFgColor?: string;
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
    width = "inherit",
    height = "36px",
    margin = "inherit",
    padding = "0 7px",
    normalFgColor = "var(--fg-toolbar-active)",
    normalBgColor = "var(--bg-toolbar-active)",
    activeBgColor = "var(--bg-toolbar-active)",
    hoverBgColor = "var(--bg-toolbar-active)",
    isActive = false,
    normalBorder = "none",
    activeBorder = "none",
    hoverBorder = "none",
    normalCursor = "pointer",
    activeCursor = "pointer",
    hoverCursor = "pointer",
    onClick,
    children,
  }: PrimaryButtonProps = $props();
</script>

<Button
  {width}
  {height}
  {margin}
  {padding}
  {normalFgColor}
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
