<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let round: number = 0;
  export let size: number | undefined = undefined;
  export let width = "inherit";
  export let height = "inherit";

  export let padding = "inherit";
  export let margin = "inherit";
  export let normalFgColor = "var(--text)";
  export let activeFgColor = "var(--text-active)";
  export let hoverFgColor = "var(--text-active)";

  export let normalBgAlpha = "1";
  export let activeBgAlpha = "1";
  export let hoverBgAlpha = "1";

  export let normalBgColor = "transparent";
  export let hoverBgColor = "var(--bg-tab-hover)";
  export let activeBgColor = "var(--bg-tab-hover)";
  export let disabledBgColor = "var(--borders)";

  export let normalBorder = "none";
  export let activeBorder = "none";
  export let hoverBorder = "none";

  export let normalCursor = "default";
  export let activeCursor = "default";
  export let hoverCursor = "default";

  export let isActive = false;
  export let disabled: boolean | undefined = false;

  if (size) {
    width = `${size}px`;
    height = `${size}px`;
  }

  function clickHandler(event: MouseEvent) {
    if (!disabled) {
      dispatch("buttonClick", event);
    }
  }
</script>

<div
  on:mouseup|capture={clickHandler}
  class={`
    ${isActive ? "button__active " : ""}
    ${disabled ? "button__disabled" : ""}
  `}
  style={`
    --padding: ${padding};
    --margin: ${margin};
    --width: ${width};
    --height: ${height};
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
  <slot />
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
