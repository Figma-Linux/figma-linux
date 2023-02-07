<script lang="ts">
  import { ipcRenderer } from "electron";
  import type { MouseWheelInputEvent } from "electron";
  import { tabs } from "../store";
  import List from "./List.svelte";

  let tabArray: Types.TabFront[] = [];
  let item: HTMLDivElement;
  tabs.subscribe((tabs) => {
    tabArray = tabs;
  });

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
        ipcRenderer.send("setTabFocus", id);
        break;
      }
      // wheel mouse button
      case 1: {
        tabs.deleteTab(id);
        ipcRenderer.send("closeTab", id);
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
    tabs.deleteTab(id);
    ipcRenderer.send("closeTab", id);
  }

  function onDndConsider(event: any) {
    tabArray = event.detail.items;
  }
  function onDndFinalize(event: any) {
    tabs.set(event.detail.items);
  }
</script>

<div class="panel-tabs" bind:this={item} on:mousewheel={wheelHandler}>
  <List items={tabArray} {onClickTitle} {onClickClose} {onDndConsider} {onDndFinalize} />
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
