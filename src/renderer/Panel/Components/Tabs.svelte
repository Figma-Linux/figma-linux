<script lang="ts">
  import { ipcRenderer } from "electron";
  import type { MouseWheelInputEvent } from "electron";
  import { tabs, currentTab } from "../store";
  import { closeTab, tabFocus } from "./utils";
  import List from "./List.svelte";

  let currentTabId: number | undefined;

  let item: HTMLDivElement;

  function wheelHandler(e: MouseWheelInputEvent) {
    if (e.deltaY > 0) {
      item.scrollLeft += 50;
    } else {
      item.scrollLeft -= 50;
    }
  }

  function onClickTitle(event: MouseEvent, id: number) {
    switch (event.button) {
      // left mouse button
      case 0: {
        tabFocus(id);
        break;
      }
      // wheel mouse button
      case 1: {
        closeTab(id);
        break;
      }
      // right mouse button
      case 2: {
        ipcRenderer.send("openTabMenu", id);
        break;
      }
    }
  }

  function onClickClose(event: MouseEvent, id: number) {
    closeTab(id);
  }

  function onDndConsider(event: any) {
    tabs.set(event.detail.items);
  }
  function onDndFinalize(event: any) {
    const items = event.detail.items as Types.TabFront[];
    tabs.set(items.map((tab, index) => ({ ...tab, order: index + 1 })));
  }

  currentTab.subscribe((id) => {
    if (typeof id === "number") {
      currentTabId = id;
    } else {
      currentTabId = undefined;
    }
  });
</script>

<div class="panel-tabs" bind:this={item} on:mousewheel={wheelHandler}>
  <List
    bind:items={$tabs}
    {currentTabId}
    {onClickTitle}
    {onClickClose}
    {onDndConsider}
    {onDndFinalize}
  />
</div>

<style>
  .panel-tabs {
    display: flex;
    flex-grow: 1;
    align-items: stretch;
    flex-flow: row;
    width: 100%;
    scrollbar-width: none;
    overflow-x: scroll;
    outline: none !important;
    color: var(--fg-tab) !important;
  }
  .panel-tabs:focus-visible {
    outline: none !important;
  }
  .panel-tabs::-webkit-scrollbar {
    display: none;
  }
</style>
