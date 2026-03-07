<script lang="ts">
  import { themeApp } from "../Common/Store/Themes";
  import { initCommonIpc } from "../Common/Ipc";
  import { getColorPallet } from "Utils/Render/themes";
  import { initIpc } from "./ipc";
  import { panelZoom } from "./store";
  import { Left, Right, Tabs } from "./Components";

  initCommonIpc();
  initIpc();

  let pallet = $state<string[]>([]);

  $effect(() => {
    const unsubscribe = themeApp.subscribe((theme) => {
      if (!theme) {
        return;
      }
      pallet = getColorPallet(theme);
    });
    return unsubscribe;
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
    height: 40px;
    background-color: var(--bg-header, #2c2c2c);
    -webkit-app-region: drag;
  }

  /* Allow clicks on interactive elements */
  #panel :global(button),
  #panel :global(a),
  #panel :global([role="button"]),
  #panel :global(.tab),
  #panel :global(.clickable) {
    -webkit-app-region: no-drag;
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
