<script lang="ts">
  export let size = "16";
  export let color = "var(--fg-header)";
</script>

<svg viewBox="0 0 16 16" fill="none" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
  <g fill={color}>
    <path d="M3 5v9h9V5H3zm8 8H4V6h7v7z" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h1V4h7v7h-1v1h2V3H5v2z" />
  </g>
</svg>
