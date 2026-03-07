<script lang="ts">
  let { size = "16", color = "var(--fg-header)" } = $props();
</script>

<svg class="svg" width={size} height={size} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M11 4.143L9.857 3 7 5.857 4.143 3 3 4.143 5.857 7 3 9.857 4.143 11 7 8.143 9.857 11 11 9.857 8.143 7 11 4.143z"
    fill-rule="nonzero"
    fill-opacity="1"
    fill={color}
    stroke="none"
  />
</svg>
