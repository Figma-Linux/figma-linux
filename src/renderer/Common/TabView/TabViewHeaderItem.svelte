<script lang="ts">
  export let text: string;

  export let round: number = 0;
  export let width = "inherit";
  export let height = "inherit";

  export let padding = "inherit";
  export let normalFgColor = "var(--fg-header)";
  export let normalBgColor = "transparent";
  export let activeFgColor = "var(--fg-tab-hover)";
  export let activeBgColor = "transparent";
  export let hoverFgColor = "var(--fg-tab-hover)";
  export let hoverBgColor = "transparent";

  export let isActive = false;
</script>

<span
  on:mousedown|capture
  on:mouseup|capture
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
    font-size: var(--font-tab-view-size);
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
