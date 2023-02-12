<script lang="ts">
  export let grow = 0;
</script>

<div style={`--flexGrow: ${grow}`}>
  <slot />
</div>

<style>
  div {
    flex-grow: var(--flexGrow);
  }
</style>
