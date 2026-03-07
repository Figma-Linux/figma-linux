<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "./Button.svelte";

  interface TertiaryButtonProps {
    padding?: string;
    normalFgColor?: string;
    activeFgColor?: string;
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
    normalFgColor = "var(--text)",
    activeFgColor = "var(--fg-toolbar-active)",
    normalBgColor = "transparent",
    activeBgColor = "var(--bg-toolbar-active)",
    hoverBgColor = "transparent",
    isActive = false,
    normalBorder = "1px solid var(--text)",
    activeBorder = "1px solid var(--bg-toolbar-active)",
    hoverBorder = "1px solid var(--text)",
    normalCursor = "pointer",
    activeCursor = "pointer",
    hoverCursor = "pointer",
    onClick,
    children,
  }: TertiaryButtonProps = $props();
</script>

<Button
  {padding}
  {normalFgColor}
  {activeFgColor}
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
  height="36px"
>
  {@render children?.()}
</Button>
