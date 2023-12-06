<script lang="ts">
  import { getColorPallet } from "Utils/Render/themes";
  import { initCommonIpc } from "../Common/Ipc";
  import { themeApp } from "../Common/Store/Themes";
  import { Left, Right, Tabs } from "./Components";
  import { initIpc } from "./ipc";
  import { panelZoom } from "./store";

  initCommonIpc();
  initIpc();

  let pallet: string[] = [];

  themeApp.subscribe((theme) => {
    if (!theme) {
      return;
    }
    pallet = getColorPallet(theme);
  });
</script>

<div id="panel" style={`zoom: ${$panelZoom}; ${pallet.join("; ")}`}>
  <Left />
  <Tabs />
  <Right />
</div>

<style>
  #panel {
    display: flex;
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
