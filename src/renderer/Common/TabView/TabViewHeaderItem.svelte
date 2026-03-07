<script lang="ts">
  interface TabViewHeaderItemProps {
    text: string;
    round?: number;
    width?: string;
    height?: string;
    padding?: string;
    normalFgColor?: string;
    normalBgColor?: string;
    activeFgColor?: string;
    activeBgColor?: string;
    hoverFgColor?: string;
    hoverBgColor?: string;
    isActive?: boolean;
    onmousedown?: (event: MouseEvent) => void;
    onmouseup?: (event: MouseEvent) => void;
  }

  let {
    text,
    round = 0,
    width = "inherit",
    height = "inherit",
    padding = "inherit",
    normalFgColor = "var(--text)",
    normalBgColor = "transparent",
    activeFgColor = "var(--text-active)",
    activeBgColor = "transparent",
    hoverFgColor = "var(--text-active)",
    hoverBgColor = "transparent",
    isActive = false,
    onmousedown,
    onmouseup,
  }: TabViewHeaderItemProps = $props();
</script>

<span
  onmousedown={onmousedown}
  onmouseup={onmouseup}
  class={isActive ? "active" : ""}
  style={`
    --width: ${width};
    --height: ${height};
    --padding: ${padding};
    --border-radius: ${round};
    --normal-fg-color: ${normalFgColor};
    --normal-bg-color: ${normalBgColor};
    --hover-fg-color: ${hoverFgColor};
    --hover-bg-color: ${hoverBgColor};
    --active-fg-color: ${activeFgColor};
    --active-bg-color: ${activeBgColor};
  `}
>
  {text}
</span>

<style>
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--normal-bg-color);
    color: var(--normal-fg-color);
    border-radius: var(--border-radius);
    width: var(--width);
    height: var(--height);
    padding: var(--padding);
    transition: all 0.1s ease;
    user-select: none;
    opacity: 0.6;
    font-size: var(--text-size-tab-view);
    white-space: nowrap;
  }
  span:hover {
    opacity: 1;
    color: var(--hover-fg-color);
    background-color: var(--hover-bg-color);
  }
  .active {
    opacity: 1;
    color: var(--active-fg-color);
    background-color: var(--active-bg-color);
  }
</style>
