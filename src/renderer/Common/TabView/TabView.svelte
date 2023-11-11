<script lang="ts">
  import { tabView } from "../Store/TabView";

  export let items: Types.TabItem[] = [];
  export let currentId = "";
  export let initItemId: string | undefined = undefined;

  export let padding = "inherit";
  export let flexDirection = "row";
  export let normalFgColor = "var(--fg-header)";
  export let normalBgColor = "inherit";

  export let onItemClick = (item: Types.TabItem) => {};

  const id = items.map((i) => i.id).join(".");

  if (initItemId) {
    tabView.set(id, initItemId);
    currentId = initItemId;
  }

  $: tabView.set(id, currentId);
</script>

<div
  on:mousedown|capture
  on:mouseup|capture
  style={`
    --padding: ${padding};
    --flex-direction: ${flexDirection};
    --normal-bg-color: ${normalBgColor};
    --normal-fg-color: ${normalFgColor};
  `}
>
  {#each items as item (item.id)}
    <svelte:component
      this={item.item}
      isActive={item.id === $tabView[id]}
      text={item.text}
      {...item.itemArgs}
      on:mouseup={() => {
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
