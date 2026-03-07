<script lang="ts">
  let { size = "16", color = "var(--fg-header)" } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 12.277H13" />
  <g fill={color}>
    <path d="M14 8v1H3V8h11z" />
  </g>
</svg>
