<script lang="ts">
  let { size = "16", color = "var(--fg-header)" } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.7834 8L3 8M7.46566 13L13 8L7.46566 3" stroke={color} />
</svg>
