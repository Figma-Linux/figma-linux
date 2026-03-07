<script lang="ts">
  import type { Snippet } from "svelte";

  interface ButtonToolProps {
    round?: number;
    size?: number;
    width?: string;
    height?: string;
    padding?: string;
    normalFgColor?: string;
    hoverFgColor?: string;
    normalBgColor?: string;
    hoverBgColor?: string;
    normalOpacity?: number;
    hoverOpacity?: number;
    disabled?: boolean;
    onClick?: () => void;
    onmouseenter?: (e: MouseEvent) => void;
    onmouseleave?: (e: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    round = 0,
    size = undefined,
    width = "auto",
    height = "auto",
    padding = "auto",
    normalFgColor = "var(--fg-header)",
    hoverFgColor = "var(--fg-tab-hover)",
    normalBgColor = "var(--bg-header)",
    hoverBgColor = "var(--bg-tab-hover)",
    normalOpacity = 0.4,
    hoverOpacity = 1,
    disabled = false,
    onClick,
    onmouseenter,
    onmouseleave,
    children,
  }: ButtonToolProps = $props();

  let effectiveWidth = $derived(size ? `${size}px` : width);
  let effectiveHeight = $derived(size ? `${size}px` : height);

  function clickHandler(event: MouseEvent) {
    if (!disabled) {
      onClick?.();
    }
  }
</script>

<div
  onmouseup={clickHandler}
  onmouseenter={(e) => onmouseenter?.(e)}
  onmouseleave={(e) => onmouseleave?.(e)}
  style={`
    --padding: ${padding};
    --width: ${effectiveWidth};
    --height: ${effectiveHeight};
    --border-radius: ${round}px;
    --normal-bg-color: ${normalBgColor};
    --hover-bg-color: ${hoverBgColor};

    --normal-fg-color: ${normalFgColor};
    --hover-fg-color: ${hoverFgColor};

    --normal-opacity: ${normalOpacity};
    --hover-opacity: ${hoverOpacity};
  `}
>
  {@render children?.()}
</div>

<style>
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--normal-bg-color);
    color: var(--normal-fg-color);
    border-radius: var(--border-radius);
    width: var(--width);
    height: var(--height);
    padding: var(--padding);
    opacity: var(--normal-opacity);
    transition: all 0.1s ease;
    -webkit-app-region: no-drag;
  }
  div:hover {
    fill: var(--hover-fg-color);
    color: var(--hover-fg-color);
    opacity: var(--hover-opacity);
  }
</style>
