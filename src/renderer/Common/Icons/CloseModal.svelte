<script lang="ts">
  let { size = "12", color = "var(--fg-header)" } = $props();
</script>

<svg class="svg" width={size} height={size} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"
  ><path
    d="M6 5.293l4.789-4.79.707.708-4.79 4.79 4.79 4.789-.707.707-4.79-4.79-4.789 4.79-.707-.707L5.293 6 .502 1.211 1.21.504 6 5.294z"
    fill-rule="nonzero"
    fill-opacity="1"
    fill={color}
    stroke="none"
  /></svg
>
