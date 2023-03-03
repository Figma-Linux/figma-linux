<script lang="ts">
  import { ipcRenderer } from "electron";
  import { HeaderModal, Button, CloseModal, FlexGrow } from "Common";
  import { TabView, TabViewHeaderItem } from "Common/TabView";
  import { General } from "./Views/General";
  import { Themes, ThemesHeaderComponent } from "./Views/Themes";
  import { ThemeCreator } from "./Views/ThemeCreator";

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
  settingsBody::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: transparent;
  }
  settingsBody::-webkit-scrollbar-corner {
    display: none;
  }
  settingsBody::-webkit-scrollbar-thumb {
    background: var(--color-scrollbar, rgba(179, 179, 179, 0.5));
    border-radius: 10px;
  }
</style>
