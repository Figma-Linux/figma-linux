<script lang="ts">
  export let size = "16";
  export let color = "var(--fg-header)";
</script>

<svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M7 1H1v6h6V1zM6 2H2v4h4V2zm9-1H9v6h6V1zm-1 1h-4v4h4V2zm1 7H9v6h6V9zm-1 1h-4v4h4v-4zM7 9H1v6h6V9zm-1 1H2v4h4v-4z"
    fill-rule="evenodd"
    fill={color}
  />
</svg>
