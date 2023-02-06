<script lang="ts">
  import { onMount } from "svelte";
  import { themeApp } from "../Common/Store/Themes";
  import { getColorPallet } from "Utils/Render/themes";
  import { initCommonIpc } from "../Common/Ipc";
  import { initIpc } from "./ipc";

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

<div id="themeCreator">
  <p>Theme Creator page</p>
</div>
