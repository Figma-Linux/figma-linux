<script lang="ts">
  export let round: number = 0;
  export let size: number | undefined = undefined;
  export let width = "inherit";
  export let height = "inherit";

  export let padding = "inherit";
  export let margin = "inherit";
  export let normalFgColor = "var(--fg-header)";
  export let normalBgColor = "var(--bg-header)";
  export let activeBgColor = "var(--bg-tab-hover)";
  export let hoverBgColor = "var(--bg-tab-hover)";

  export let isActive = false;

  if (size) {
    width = `${size}px`;
    height = `${size}px`;
  }
</script>

<div
  on:mousedown|capture
  on:mouseup|capture
  class={isActive ? "button__active" : ""}
  style={`
    --padding: ${padding};
    --margin: ${margin};
    --width: ${width};
    --height: ${height};
    --border-radius: ${round}px;
    --normal-bg-color: ${normalBgColor};
    --hover-bg-color: ${hoverBgColor};
    --active-bg-color: ${activeBgColor};
    --normal-fg-color: ${normalFgColor};
  `}
>
  <slot />
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
    margin: var(--margin);
    transition: all 0.08s ease;
  }
  div:hover {
    background-color: var(--hover-bg-color);
  }
  .button__active {
    background-color: var(--active-bg-color);
  }
</style>
