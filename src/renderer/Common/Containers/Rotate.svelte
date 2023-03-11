<script lang="ts">
  export let deg = 0;
</script>

<div
  style={`
    --deg: ${deg}deg;
  `}
>
  <slot />
</div>

<style>
  div {
    display: flex;
    transform: rotate(var(--deg));
  }
</style>
