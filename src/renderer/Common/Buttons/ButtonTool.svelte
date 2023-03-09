<script lang="ts">
  export let round: number = 0;
  export let size: number | undefined = undefined;
  export let width = "auto";
  export let height = "auto";

  export let padding = "auto";
  export let normalFgColor = "var(--fg-header)";
  export let hoverFgColor = "var(--fg-tab-hover)";

  export let normalBgColor = "var(--bg-header)";
  export let hoverBgColor = "var(--bg-tab-hover)";

  export let normalOpacity = 0.4;
  export let hoverOpacity = 1;

  if (size) {
    width = `${size}px`;
    height = `${size}px`;
  }
</script>

<div
  on:mousedown|capture
  on:mouseup|capture
  style={`
    --padding: ${padding};
    --width: ${width};
    --height: ${height};
    --border-radius: ${round}px;
    --normal-bg-color: ${normalBgColor};
    --hover-bg-color: ${hoverBgColor};

    --normal-fg-color: ${normalFgColor};
    --hover-fg-color: ${hoverFgColor};

    --normal-opacity: ${normalOpacity};
    --hover-opacity: ${hoverOpacity};
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
    opacity: var(--normal-opacity);
    transition: all 0.1s ease;
  }
  div:hover {
    fill: var(--hover-fg-color);
    color: var(--hover-fg-color);
    opacity: var(--hover-opacity);
  }
</style>
