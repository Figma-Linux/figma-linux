<script lang="ts">
  export let normalFgColor = "var(--fg-header)";
  export let normalBgColor = "var(--bg-header)";
  export let activeBgColor = "var(--bg-tab-hover)";
  export let hoverBgColor = "var(--bg-tab-hover)";
  export let isActive = false;
  export let onClick = (event: MouseEvent) => {};
</script>

<div
  on:mouseup|capture={onClick}
  class={`${$$props.class || ""} ${isActive ? "button__active" : ""}`}
  style={`
    --button-normal-bg-color: ${normalBgColor};
    --button-hover-bg-color: ${hoverBgColor};
    --button-active-bg-color: ${activeBgColor};
    --button-normal-fg-color: ${normalFgColor};
  `}
>
  <slot />
</div>

<style>
  div {
    display: flex;
    align-items: center;
    background-color: var(--button-normal-bg-color);
    color: var(--button-normal-fg-color);
  }
  div:hover {
    background-color: var(--button-hover-bg-color);
  }
  .button__active {
    background-color: var(--button-active-bg-color);
  }
</style>
