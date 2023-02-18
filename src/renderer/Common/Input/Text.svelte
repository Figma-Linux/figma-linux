<script lang="ts">
  export let value: string;

  export let width = "auto";
  export let placeholder = "";
</script>

<input
  bind:value
  style={`
    --inputWidth: ${width};
  `}
  type="text"
  {placeholder}
/>

<style>
  input {
    background-color: transparent;
    outline: none;
    color: var(--text);
    border: 1px solid var(--borders);
    border-radius: 3px;
    padding: 8px;
    width: var(--inputWidth);
  }

  input:hover,
  input:active,
  input:focus {
    background-color: transparent;
    outline: none;
    border: 1px solid var(--borders);
  }
</style>
