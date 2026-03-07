<script lang="ts">
  import { untrack } from "svelte";
  import { tabView } from "../Store/TabView";

  interface TabViewProps {
    items?: Types.TabItem[];
    currentId?: string;
    initItemId?: string;
    padding?: string;
    flexDirection?: string;
    normalFgColor?: string;
    normalBgColor?: string;
    onItemClick?: (item: Types.TabItem) => void;
    onmousedown?: (event: MouseEvent) => void;
    onmouseup?: (event: MouseEvent) => void;
  }

  let {
    items = [],
    currentId = $bindable(""),
    initItemId = undefined,
    padding = "inherit",
    flexDirection = "row",
    normalFgColor = "var(--fg-header)",
    normalBgColor = "inherit",
    onItemClick = () => {},
    onmousedown,
    onmouseup,
  }: TabViewProps = $props();

  const id = $derived(items.map((i) => i.id).join("."));

  // Initialize once with initItemId if provided
  untrack(() => {
    if (initItemId) {
      tabView.set(id, initItemId);
      currentId = initItemId;
    }
  });

  $effect(() => {
    tabView.set(id, currentId);
  });
</script>

<div
  onmousedown={onmousedown}
  onmouseup={onmouseup}
  style={`
    --padding: ${padding};
    --flex-direction: ${flexDirection};
    --normal-bg-color: ${normalBgColor};
    --normal-fg-color: ${normalFgColor};
  `}
>
  {#each items as item (item.id)}
    {@const ItemComponent = item.item}
    <ItemComponent
      isActive={item.id === $tabView[id]}
      text={item.text}
      {...item.itemArgs}
      onmouseup={() => {
        currentId = item.id;
        tabView.set(id, item.id);
        onItemClick(item);
      }}
    />
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-direction: var(--flex-direction);
    background-color: var(--normal-bg-color);
    color: var(--normal-fg-color);
    padding: var(--padding);
  }
</style>
