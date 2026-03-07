<script lang="ts">
  import type { Snippet } from "svelte";

  interface ButtonProps {
    round?: number;
    size?: number;
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    normalFgColor?: string;
    activeFgColor?: string;
    hoverFgColor?: string;
    normalBgAlpha?: string;
    activeBgAlpha?: string;
    hoverBgAlpha?: string;
    normalBgColor?: string;
    hoverBgColor?: string;
    activeBgColor?: string;
    disabledBgColor?: string;
    normalBorder?: string;
    activeBorder?: string;
    hoverBorder?: string;
    normalCursor?: string;
    activeCursor?: string;
    hoverCursor?: string;
    isActive?: boolean;
    disabled?: boolean;
    onClick?: (event: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    round = 0,
    size = undefined,
    width = "inherit",
    height = "inherit",
    padding = "inherit",
    margin = "inherit",
    normalFgColor = "var(--text)",
    activeFgColor = "var(--text-active)",
    hoverFgColor = "var(--text-active)",
    normalBgAlpha = "1",
    activeBgAlpha = "1",
    hoverBgAlpha = "1",
    normalBgColor = "transparent",
    hoverBgColor = "var(--bg-tab-hover)",
    activeBgColor = "var(--bg-tab-hover)",
    disabledBgColor = "var(--borders)",
    normalBorder = "none",
    activeBorder = "none",
    hoverBorder = "none",
    normalCursor = "default",
    activeCursor = "default",
    hoverCursor = "default",
    isActive = false,
    disabled = false,
    onClick,
    children,
  }: ButtonProps = $props();

  let effectiveWidth = $derived(size ? `${size}px` : width);
  let effectiveHeight = $derived(size ? `${size}px` : height);

  function clickHandler(event: MouseEvent) {
    if (!disabled) {
      onClick?.(event);
    }
  }
</script>

<div
  onmouseup={clickHandler}
  class={`
    ${isActive ? "button__active " : ""}
    ${disabled ? "button__disabled" : ""}
  `}
  style={`
    --padding: ${padding};
    --margin: ${margin};
    --width: ${effectiveWidth};
    --height: ${effectiveHeight};
    --border-radius: ${round}px;

    --normal-bg-alpha: ${normalBgAlpha};
    --active-bg-alpha: ${activeBgAlpha};
    --hover-bg-alpha: ${hoverBgAlpha};

    --normal-bg-color: ${normalBgColor};
    --hover-bg-color: ${hoverBgColor};
    --active-bg-color: ${activeBgColor};
    --disabled-bg-color: ${disabledBgColor};

    --normal-fg-color: ${normalFgColor};
    --active-fg-color: ${activeFgColor};
    --hover-fg-color: ${hoverFgColor};

    --normal-border: ${normalBorder};
    --active-border: ${activeBorder};
    --hover-border: ${hoverBorder};

    --normal-cursor: ${normalCursor};
    --active-cursor: ${activeCursor};
    --hover-cursor: ${hoverCursor};
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
    border: var(--normal-border);
    cursor: var(--normal-cursor);
    border-radius: var(--border-radius);
    width: var(--width);
    height: var(--height);
    padding: var(--padding);
    margin: var(--margin);
    transition: all 0.08s ease;
    user-select: none;
    -webkit-app-region: no-drag;
  }
  div:hover {
    border: var(--hover-border);
    cursor: var(--hover-cursor);
    color: var(--hover-fg-color);
    background-color: var(--hover-bg-color);
  }
  div:active {
    border: var(--active-border);
    cursor: var(--active-cursor);
    color: var(--active-fg-color);
    background-color: var(--active-bg-color);
  }
  .button__active {
    border: var(--active-border);
    cursor: var(--active-cursor);
    color: var(--active-fg-color);
    background-color: var(--active-bg-color);
  }
  .button__active:hover {
    border: var(--active-border);
    cursor: var(--active-cursor);
    color: var(--active-fg-color);
    background-color: var(--active-bg-color);
  }

  .button__disabled {
    user-select: none;
    background-color: var(--disabled-bg-color);
  }
  .button__disabled:hover {
    user-select: none;
    background-color: var(--disabled-bg-color);
  }
</style>
