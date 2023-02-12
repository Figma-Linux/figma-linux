<script lang="ts">
  import { tabView } from "../Store/TabView";

  export let items: Types.TabItem[] = [];
  export let initItemId: string | undefined = undefined;

  export let padding = "inherit";
  export let flexDirection = "row";
  export let normalFgColor = "var(--fg-header)";
  export let normalBgColor = "inherit";

  export let onItemClick = (item: Types.TabItem) => {};

  if (initItemId) {
    tabView.set(initItemId);
  }
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
      isActive={item.id === $tabView}
      text={item.text}
      {...item.itemArgs}
      on:mouseup={() => {
        tabView.set(item.id);
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
