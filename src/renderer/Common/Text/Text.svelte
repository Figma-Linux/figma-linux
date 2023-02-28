<script lang="ts">
  export let padding = "inherit";
</script>

<span
  style={`
    --padding: ${padding};
  `}
>
  <slot />
</span>

<style>
  span {
    color: var(--text);
    padding: var(--padding);
  }
</style>
