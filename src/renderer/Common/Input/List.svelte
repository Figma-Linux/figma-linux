<script lang="ts">
  export let items: Types.TabItem[] = [];

  export let width = "auto";
  export let height = "auto";

  export let onItemClick = (item: Types.TabItem) => {};
  export let onItemRemoveClick = (item: Types.TabItem) => {};
</script>

<div
  style={`
  --width: ${width};
  --height: ${height};
`}
>
  {#each items as item (item.id)}
    <svelte:component
      this={item.item}
      text={item.text}
      {...item.itemArgs}
      onItemRemoveClick={() => {
        onItemRemoveClick(item);
      }}
      onItemClick={() => {
        onItemClick(item);
      }}
    />
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--borders);
    border-radius: 3px;
    padding: 8px 8px 8px 16px;
    width: var(--width);
    height: var(--height);
    overflow-x: auto;
    overflow-y: auto;
  }
  div::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: transparent;
  }
  div::-webkit-scrollbar-corner {
    display: none;
  }
  div::-webkit-scrollbar-thumb {
    background: var(--color-scrollbar, rgba(179, 179, 179, 0.5));
    border-radius: 10px;
  }
</style>
