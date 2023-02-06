<script lang="ts">
  export let isSpinner = false;

  const classes = ["icon"];

  isSpinner && classes.push("spin");
</script>

<div class={classes.join(" ")}>
  <slot />
</div>

<style>
  .icon {
    padding: 9px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
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
