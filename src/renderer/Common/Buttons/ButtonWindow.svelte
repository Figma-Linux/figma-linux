<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "./Button.svelte";

  interface ButtonWindowProps {
    padding?: string;
    normalBgColor?: string;
    activeBgColor?: string;
    hoverBgColor?: string;
    isActive?: boolean;
    onClick?: (event: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    padding = "0px 18px",
    normalBgColor = "var(--bg-header-control)",
    activeBgColor = "var(--bg-header-control-hover)",
    hoverBgColor = "var(--bg-header-control-hover)",
    isActive = false,
    onClick,
    children,
  }: ButtonWindowProps = $props();
</script>

<Button {padding} {normalBgColor} {activeBgColor} {hoverBgColor} {isActive} {onClick}>
  {@render children?.()}
</Button>
