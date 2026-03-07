<script lang="ts">
  let { size = "16", color = "var(--fg-header)" } = $props();
</script>

<svg class="svg" width={size} height={size} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.5 6.5v1h4v4h1v-4h4v-1h-4v-4h-1v4h-4z" fill={color} />
</svg>
