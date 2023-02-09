<script lang="ts">
  export let isActive: boolean = false;
  export let onClick = (event: MouseEvent) => {};
</script>

<div
  on:mouseup|capture={onClick}
  class={`${$$props.class || ""} ${isActive ? "button__active" : ""}`}
>
  <slot />
</div>

<style>
  div {
    display: flex;
    align-items: center;
  }
  div:hover {
    background-color: var(--bg-tab-hover);
  }
  .button__active {
    background-color: var(--bg-tab-hover);
  }
</style>
