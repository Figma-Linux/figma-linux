<script lang="ts">
  import { ipcRenderer } from "electron";
  import { HeaderModal, Button, CloseModal, FlexGrow } from "Common";
  import { TabView, TabViewHeaderItem } from "Common/TabView";
  import General from "./Views/General.svelte";
  import Themes from "./Views/Themes.svelte";
  import ThemeCreator from "./Views/ThemeCreator.svelte";

  const items: Types.TabItem[] = [
    {
      id: "general",
      text: "General",
      itemArgs: {
        padding: "14px 10px",
      },
      item: TabViewHeaderItem,
      component: General,
    },
    {
      id: "themes",
      text: "Themes",
      itemArgs: {
        padding: "14px 10px",
      },
      item: TabViewHeaderItem,
      component: Themes,
    },
    {
      id: "themeCreator",
      text: "Theme Creator",
      itemArgs: {
        padding: "14px 10px",
      },
      item: TabViewHeaderItem,
      component: ThemeCreator,
    },
  ];

  let currentItem = items[0];

  function onTabItemClick(item: Types.TabItem) {
    currentItem = item;
  }
  function onSettingsClose() {
    ipcRenderer.send("closeSettingsView");
  }
</script>

<div>
  <HeaderModal>
    <FlexGrow grow={1}>
      <TabView {items} initItemId={"general"} onItemClick={onTabItemClick} />
    </FlexGrow>
    <Button size={32} round={3} on:mouseup={onSettingsClose}>
      <CloseModal />
    </Button>
  </HeaderModal>
  <svelte:component this={currentItem.component} />
</div>

<style>
  div {
    width: 90vw;
    height: 80vh;
    overflow: hidden;
    background: var(--bg-panel);
    border: 1px solid var(--borders);
  }
</style>
