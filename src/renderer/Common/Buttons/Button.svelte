<script lang="ts">
  export let onClick = (event: MouseEvent) => {};
</script>

<div on:mouseup|capture={onClick} class={$$props.class || ""}>
  <slot />
</div>

<style>
  div {
    display: flex;
    align-items: center;
  }
</style>
