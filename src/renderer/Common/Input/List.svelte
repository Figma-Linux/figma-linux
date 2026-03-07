<script lang="ts">
  interface ListProps {
    items?: Types.TabItem[];
    width?: string;
    height?: string;
    border?: string;
    padding?: string;
    bradius?: string;
    onItemClick?: (item: Types.TabItem) => void;
    onItemRemoveClick?: (item: Types.TabItem) => void;
  }

  let {
    items = [],
    width = "auto",
    height = "auto",
    border = "1px solid var(--borders)",
    padding = "8px 8px 8px 16px",
    bradius = "3px",
    onItemClick = () => {},
    onItemRemoveClick = () => {},
  }: ListProps = $props();
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
    {@const ItemComponent = item.item}
    <ItemComponent
      text={item.text}
      {...item.itemArgs}
      disabled={item.disabled ?? false}
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
