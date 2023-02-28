<script lang="ts">
  export let value: string;

  export let width = "auto";
  export let placeholder = "";
</script>

<div>
  <slot />
  <input
    bind:value
    style={`
      --inputWidth: ${width};
    `}
    type="text"
    {placeholder}
  />
</div>

<style>
  div {
    display: flex;
    border: 1px solid var(--borders);
    border-radius: 3px;
    padding: 8px;
    width: var(--inputWidth);
  }
  input {
    background-color: transparent;
    outline: none;
    color: var(--text);
    border: 0;
    margin-left: 6px;
    width: -webkit-fill-available;
  }

  input:hover,
  input:active,
  input:focus {
    background-color: transparent;
    outline: none;
    border: 0;
  }
</style>
