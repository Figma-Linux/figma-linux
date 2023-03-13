<script lang="ts">
  export let items: Types.TabItem[] = [];

  export let width = "auto";
  export let height = "auto";
  export let border = "1px solid var(--borders)";
  export let padding = "8px 8px 8px 16px";
  export let bradius = "3px";

  export let onItemClick = (item: Types.TabItem) => {};
  export let onItemRemoveClick = (item: Types.TabItem) => {};
</script>

<div
  style={`
  --width: ${width};
  --height: ${height};
  --border: ${border};
  --padding: ${padding};
  --bradius: ${bradius};
`}
>
  {#each items as item (item.id)}
    <svelte:component
      this={item.item}
      text={item.text}
      {...item.itemArgs}
      disabled={item.disabled}
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
    border: var(--border);
    border-radius: var(--bradius);
    padding: var(--padding);
    width: var(--width);
    height: var(--height);
    overflow-x: auto;
    overflow-y: auto;
  }
</style>
