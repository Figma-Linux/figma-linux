<script lang="ts">
  import { ipcRenderer } from "electron";
  import { themeApp } from "../Common/Store/Themes";
  import { getColorPallet } from "Utils/Render/themes";
  import { initCommonIpc } from "../Common/Ipc";
  import { initIpc } from "./ipc";
  import { settings } from "./store";

  import Body from "./Components/Body.svelte";

  initCommonIpc();
  initIpc();

  let pallet: string[] = [];

  themeApp.subscribe((theme) => {
    if (!theme) {
      return;
    }
    pallet = getColorPallet(theme);
  });

  function onCloseModalHandler(event: SvelteEvents.Empty) {
    settings.trim();
    ipcRenderer.send("closeSettingsView", $settings);
  }
</script>

<div on:mousedown|self={onCloseModalHandler} id="settings" style={pallet.join("; ")}>
  <Body on:closeSettings={onCloseModalHandler} />
</div>

<style>
  :global(body) {
    background-color: rgba(0, 0, 0, 0.5);
  }
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>
