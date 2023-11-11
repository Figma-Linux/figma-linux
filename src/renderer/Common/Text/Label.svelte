<script lang="ts">
  export let padding = "0 0 20px 0";
</script>

<span
  style={`
    --padding: ${padding}
  `}
>
  <slot />
</span>

<style>
  span {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-active);
    padding: var(--padding);
  }
</style>
