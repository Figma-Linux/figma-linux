<script lang="ts">
  import { ButtonWindow } from "Common/Buttons";
  import { Close, Corner, Maximize, Minimize } from "Icons";
  import { ipcRenderer } from "electron";
  import { isMenuOpen, tabs } from "../store";

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
    <Corner size="16" />
  </ButtonWindow>
  <ButtonWindow on:buttonClick={() => ipcRenderer.send("windowMinimize")}>
    <Minimize size="16" />
  </ButtonWindow>
  <ButtonWindow on:buttonClick={() => ipcRenderer.send("windowMaximize")}>
    <Maximize size="16" />
  </ButtonWindow>
  <ButtonWindow hoverBgColor={"var(--bg-window-close)"} on:buttonClick={closeHandler}>
    <Close size="16" />
  </ButtonWindow>
</div>

<style>
  .panel-right {
    display: flex;
    align-items: stretch
  }
</style>
