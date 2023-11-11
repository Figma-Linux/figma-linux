<script lang="ts">
  export let spin = false;
</script>

<div class={spin ? "spin" : ""}>
  <slot />
</div>

<style>
  div {
    display: flex;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .spin {
    animation-name: spin;
    animation-duration: 1000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
</style>
