<script lang="ts">
  import { themeApp } from "../Common/Store/Themes";
  import { initCommonIpc } from "../Common/Ipc";
  import { getColorPallet } from "Utils/Render/themes";
  import { initIpc } from "./ipc";
  import { currentTab, panelZoom } from "./store";

  import { Left, Right, Tabs } from "./Components";

  initCommonIpc();
  initIpc();

  let currentTabId: number | undefined;
  let pallet: string[] = [];

  themeApp.subscribe((theme) => {
    if (!theme) {
      return;
    }
    pallet = getColorPallet(theme);
  });
  currentTab.subscribe((id) => {
    currentTabId = id;
  });
</script>

<div id="panel" style={`zoom: ${$panelZoom}; ${pallet.join("; ")}`}>
  <Left {currentTabId} />
  <Tabs {currentTabId} />
  <Right />
</div>

<style>
  #panel {
    display: flex;
    height: 40px;
    background-color: var(--bg-header);
  }

  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
    border: none;

    --text-size-tab: 14px;
    --text-size-tab-view: 14px;
    --text-size-popup: 14px;
    /* --fontSize: 16px;
    --fontSubtitleSize: 18px;
    --fontTitleSize: 22px; */

    font-family: "Inter", sans-serif;
    font-size: var(--fontSize);
    font-weight: 400;
  }
</style>
