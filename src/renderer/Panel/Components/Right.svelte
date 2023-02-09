<script lang="ts">
  import { ipcRenderer } from "electron";
  import { Minimize, Maximize, Close, Corner } from "Icons";
  import { ButtonClose, ButtonWinControl } from "Common/Buttons";
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
  <ButtonWinControl isActive={$isMenuOpen} onClick={clickMenu}>
    <Corner size="14" />
  </ButtonWinControl>
  <ButtonWinControl onClick={() => ipcRenderer.send("window-minimize")}>
    <Minimize size="16" />
  </ButtonWinControl>
  <ButtonWinControl onClick={() => ipcRenderer.send("window-maximize")}>
    <Maximize size="16" />
  </ButtonWinControl>
  <ButtonClose onClick={() => ipcRenderer.send("windowClose")}>
    <Close size="16" />
  </ButtonClose>
</div>

<style>
  .panel-right {
    display: flex;
    align-items: stretch;
  }
</style>
