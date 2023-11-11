<script lang="ts">
  export let bgColor = "var(--bg-header)";
</script>

<div
  style={`
    --bg-color: ${bgColor};
  `}
>
  <slot />
</div>

<style>
  div {
    display: flex;
    align-items: center;
    background-color: var(--bg-color);
  }
</style>
