<script lang="ts">
  import { onMount } from "svelte";
  import { ipcRenderer } from "electron";
  import { HeaderModal, Button, CloseModal, FlexItem } from "Common";
  import { TabView, TabViewHeaderItem } from "Common/TabView";
  import { General } from "./Views/General";
  import { Themes, ThemesHeaderComponent } from "./Views/Themes";
  import { ThemeCreator } from "./Views/ThemeCreator";
  import { modalBounds } from "../store";

  const items: Types.SetingsTabItem[] = [
    {
      id: "general",
      text: "General",
      itemArgs: {
        padding: "14px 10px",
      },
      item: TabViewHeaderItem,
      bodyComponent: General,
    },
    {
      id: "themes",
      text: "Themes",
      itemArgs: {
        padding: "14px 10px",
      },
      item: TabViewHeaderItem,
      bodyComponent: Themes,
      headerComponent: ThemesHeaderComponent,
    },
    {
      id: "themeCreator",
      text: "Theme Creator",
      itemArgs: {
        padding: "14px 10px",
      },
      item: TabViewHeaderItem,
      bodyComponent: ThemeCreator,
    },
  ];

  let currentItem = items[0];

  function onTabItemClick(item: Types.SetingsTabItem) {
    currentItem = item;
  }
  function onSettingsClose() {
    ipcRenderer.send("closeSettingsView");
  }

  let modal: HTMLElement;
  function getModalBounds() {
    modalBounds.set(modal.getBoundingClientRect());
  }
  onMount(getModalBounds);
  window.addEventListener("resize", getModalBounds);
</script>

<div bind:this={modal}>
  <HeaderModal>
    <FlexItem grow={1}>
      <TabView {items} initItemId={"general"} onItemClick={onTabItemClick} />
    </FlexItem>
    <svelte:component this={currentItem.headerComponent} />
    <Button size={32} round={3} on:mouseup={onSettingsClose}>
      <CloseModal />
    </Button>
  </HeaderModal>
  <settingsBody>
    <svelte:component this={currentItem.bodyComponent} />
  </settingsBody>
</div>

<style>
  div {
    width: 90vw;
    height: 80vh;
    overflow: hidden;
    background: var(--bg-panel);
  }
  settingsBody {
    display: block;
    scroll-behavior: smooth;
    overflow-y: auto;
    height: calc(80vh - 46px);
  }
</style>
