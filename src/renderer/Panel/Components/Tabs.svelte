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
    console.log("onClickTitle, tab id: ", event.button, id);
    switch (event.button) {
      case 1: {
        ipcRenderer.send("openTabMenu", id);
        break;
      }
    }
  }

  function onClickClose(event: MouseEvent, id: number) {
    console.log("onClickClose, tab id: ", id);
  }
</script>

<div class="panel-tabs" bind:this={item} on:mousewheel={wheelHandler}>
  <List items={tabArray} {onClickTitle} {onClickClose} />
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
