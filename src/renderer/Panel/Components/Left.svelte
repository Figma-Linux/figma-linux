<script lang="ts">
  import { ipcRenderer } from "electron";
  import { Figma, Plus } from "Icons";
  import { ButtonHome, ButtonControlHover } from "Common/Buttons";
  import { currentTab } from "../store";

  export let currentTabId: number | undefined;

  let isActive = false;

  $: isActive = currentTabId === undefined;

  function onClickHome() {
    ipcRenderer.send("setFocusToMainTab");
    currentTab.set(undefined);
  }
  function onClickNewProject() {
    ipcRenderer.send("newProject");
  }
</script>

<div class="panel-left">
  <ButtonHome {isActive} onClick={onClickHome}>
    <Figma size="22" />
  </ButtonHome>
  <ButtonControlHover onClick={onClickNewProject}>
    <Plus size="15" />
  </ButtonControlHover>
</div>

<style>
  .panel-left {
    display: flex;
    align-items: stretch;
  }
</style>
