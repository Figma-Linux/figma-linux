<script lang="ts">
  import { ipcRenderer } from "electron";
  import { Minimize, Maximize, Close, Corner } from "Icons";
  import { ButtonWindow } from "Common/Buttons";
  import { tabs, isMenuOpen } from "../store";

  function clickMenu() {
    if ($isMenuOpen) {
      return;
    }

    ipcRenderer.send("openMainMenu");
    isMenuOpen.toggle();
  }

  function closeHandler() {
    ipcRenderer.send("windowClose", $tabs);
  }
</script>

<div class="panel-right">
  <ButtonWindow isActive={$isMenuOpen} on:buttonClick={clickMenu}>
    <Corner size="14" />
  </ButtonWindow>
  <ButtonWindow on:buttonClick={() => ipcRenderer.send("window-minimize")}>
    <Minimize size="16" />
  </ButtonWindow>
  <ButtonWindow on:buttonClick={() => ipcRenderer.send("window-maximize")}>
    <Maximize size="16" />
  </ButtonWindow>
  <ButtonWindow hoverBgColor={"var(--bg-window-close)"} on:buttonClick={closeHandler}>
    <Close size="16" />
  </ButtonWindow>
</div>

<style>
  .panel-right {
    display: flex;
    align-items: stretch;
  }
</style>
