<script lang="ts">
  import { themeApp } from "../Common/Store/Themes";
  import { getColorPallet } from "Utils/Render/themes";
  import { initCommonIpc } from "../Common/Ipc";
  import { initIpc } from "./ipc";
  import { settings } from "./store";

  import Body from "./Components/Body.svelte";

  const api = window.settingsAPI;

  let loadError = $state<string | null>(null);
  let isLoaded = $state(false);

  try {
    initCommonIpc();
    initIpc();
    isLoaded = true;
  } catch (e) {
    loadError = String(e);
  }

  // Use $derived with store auto-subscription ($themeApp)
  let pallet = $derived($themeApp ? getColorPallet($themeApp) : []);

  function onCloseModalHandler(event: MouseEvent | CustomEvent) {
    settings.trim();
    // Get current settings value from the store and pass to main process
    let currentSettings: any;
    settings.subscribe(s => currentSettings = s)();
    api.closeSettingsView(currentSettings);
  }
</script>

<div onmousedown={(e) => e.target === e.currentTarget && onCloseModalHandler(e)} id="settings" style={pallet.join("; ")}>
  {#if loadError}
    <div class="error-box">
      <h2>Settings Load Error</h2>
      <p>{loadError}</p>
      <button onclick={onCloseModalHandler}>Close</button>
    </div>
  {:else}
    <Body oncloseSettings={onCloseModalHandler} />
  {/if}
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
  .error-box {
    background: #333;
    color: white;
    padding: 20px;
    border-radius: 8px;
  }
  button {
    margin-top: 10px;
    padding: 8px 16px;
    cursor: pointer;
  }
</style>
