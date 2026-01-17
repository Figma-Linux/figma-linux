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
  <ButtonWindow isActive={$isMenuOpen} on:buttonClick={clickMenu}>
    <Corner size="14" />
  </ButtonWindow>
  <ButtonWindow on:buttonClick={() => api.windowMinimize()}>
    <Minimize size="16" />
  </ButtonWindow>
  <ButtonWindow on:buttonClick={() => api.windowMaximize()}>
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
