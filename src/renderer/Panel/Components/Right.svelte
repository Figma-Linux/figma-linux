<script lang="ts">
  import { Minimize, Maximize, Close, Corner } from "Icons";
  import { ButtonWindow } from "Common/Buttons";
  import { tabs, isMenuOpen } from "../store";

  const api = window.panelAPI;

  function clickMenu() {
    if ($isMenuOpen) {
      return;
    }

    api.openMainMenu();
    isMenuOpen.toggle();
  }

  function closeHandler() {
    api.windowClose();
  }
</script>

<div class="panel-right">
  <ButtonWindow isActive={$isMenuOpen} onClick={clickMenu}>
    <Corner size="14" />
  </ButtonWindow>
  <ButtonWindow onClick={() => api.windowMinimize()}>
    <Minimize size="16" />
  </ButtonWindow>
  <ButtonWindow onClick={() => api.windowMaximize()}>
    <Maximize size="16" />
  </ButtonWindow>
  <ButtonWindow hoverBgColor={"var(--bg-window-close)"} onClick={closeHandler}>
    <Close size="16" />
  </ButtonWindow>
</div>

<style>
  .panel-right {
    display: flex;
    align-items: stretch;
  }
</style>
