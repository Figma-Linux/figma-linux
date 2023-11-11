<script lang="ts">
  export let bgColor = "var(--bg-header)";
</script>

<div
  style={`
    --bg-color: ${bgColor};
  `}
>
  <slot />
</div>

<style>
  div {
    display: flex;
    align-items: center;
    background-color: var(--bg-color);
    padding-right: 20px;
    padding-left: 22px;
    border-bottom: 1px solid var(--borders);
  }
</style>
