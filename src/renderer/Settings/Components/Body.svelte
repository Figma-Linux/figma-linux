<script lang="ts">
  import { ipcRenderer } from "electron";
  import { HeaderModal, Button, CloseModal, FlexGrow } from "Common";
  import { TabView, TabViewHeaderItem } from "Common/TabView";
  import { General } from "./Views/General";
  import { Themes } from "./Views/Themes";
  import { ThemeCreator, ThemeCreatorHeaderComponent } from "./Views/ThemeCreator";

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
    },
    {
      id: "themeCreator",
      text: "Theme Creator",
      itemArgs: {
        padding: "14px 10px",
      },
      item: TabViewHeaderItem,
      bodyComponent: ThemeCreator,
      headerComponent: ThemeCreatorHeaderComponent,
    },
  ];

  let currentItem = items[0];

  function onTabItemClick(item: Types.SetingsTabItem) {
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
    <svelte:component this={currentItem.headerComponent} />
    <Button size={32} round={3} on:mouseup={onSettingsClose}>
      <CloseModal />
    </Button>
  </HeaderModal>
  <svelte:component this={currentItem.bodyComponent} />
</div>

<style>
  div {
    width: 90vw;
    height: 80vh;
    overflow: hidden;
    background: var(--bg-panel);
  }
</style>
