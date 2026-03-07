<script lang="ts">
  let { size = "16", color = "var(--fg-header)" } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 9.2L8 2L14 9.2V14H9.71429V10.4H6.28571V14H2V9.2Z" fill={color} />
</svg>
