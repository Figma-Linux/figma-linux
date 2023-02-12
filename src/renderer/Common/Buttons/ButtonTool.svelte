<script lang="ts">
  export let round: number = 0;
  export let size: number | undefined = undefined;
  export let width = "inherit";
  export let height = "inherit";

  export let padding = "inherit";
  export let normalFgColor = "var(--fg-header)";
  export let normalBgColor = "var(--bg-header)";
  export let hoverBgColor = "var(--bg-tab-hover)";

  if (size) {
    width = `${size}px`;
    height = `${size}px`;
  }
</script>

<div
  on:mousedown|capture
  on:mouseup|capture
  style={`
    --button-padding: ${padding};
    --button-width: ${width};
    --button-height: ${height};
    --button-border-radius: ${round}px;
    --button-normal-bg-color: ${normalBgColor};
    --button-hover-bg-color: ${hoverBgColor};
    --button-normal-fg-color: ${normalFgColor};
  `}
>
  <slot />
</div>

<style>
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--button-normal-bg-color);
    color: var(--button-normal-fg-color);
    border-radius: var(--button-border-radius);
    width: var(--button-width);
    height: var(--button-height);
    padding: var(--button-padding);
    opacity: 0.4;
    transition: all 0.1s ease;
  }
  div:hover {
    opacity: 1;
  }
</style>
