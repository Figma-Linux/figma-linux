<script lang="ts">
  import { onMount } from "svelte";
  import { themeApp } from "../Common/Store/Themes";
  import { getColorPallet } from "Utils/Render/themes";
  import { initCommonIpc } from "../Common/Ipc";
  import { initIpc } from "./ipc";
  import Body from "./Components/Body.svelte";

  let pallet: string[] = [];

  themeApp.subscribe((theme) => {
    if (!theme) {
      return;
    }
    pallet = getColorPallet(theme);
  });

  onMount(() => {
    initCommonIpc();
    initIpc();
  });
</script>

<div id="settings" style={pallet.join("; ")}>
  <Body />
</div>

<style>
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>
