<script lang="ts">
  import { ipcRenderer } from "electron";
  import { Minimize, Maximize, Close, Corner } from "Icons";
  import { ButtonWindow } from "Common/Buttons";
  import { isMenuOpen } from "../store";

  function clickMenu() {
    if ($isMenuOpen) {
      return;
    }

    ipcRenderer.send("openMainMenu");
    isMenuOpen.toggle();
  }
</script>

<div class="panel-right">
  <ButtonWindow isActive={$isMenuOpen} on:mouseup={clickMenu}>
    <Corner size="14" />
  </ButtonWindow>
  <ButtonWindow on:mouseup={() => ipcRenderer.send("window-minimize")}>
    <Minimize size="16" />
  </ButtonWindow>
  <ButtonWindow on:mouseup={() => ipcRenderer.send("window-maximize")}>
    <Maximize size="16" />
  </ButtonWindow>
  <ButtonWindow
    hoverBgColor={"var(--bg-window-close)"}
    on:mouseup={() => ipcRenderer.send("windowClose")}
  >
    <Close size="16" />
  </ButtonWindow>
</div>

<style>
  .panel-right {
    display: flex;
    align-items: stretch;
  }
</style>
