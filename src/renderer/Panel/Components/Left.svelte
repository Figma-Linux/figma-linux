<script lang="ts">
  import { ipcRenderer } from "electron";
  import { Figma, Plus } from "Icons";
  import { ButtonWindow, ButtonTool } from "Common/Buttons";
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
  <ButtonWindow
    padding={"0px 10px"}
    hoverBgColor={"var(--bg-tab-hover)"}
    activeBgColor={"var(--bg-tab-hover)"}
    {isActive}
    on:mouseup={onClickHome}
  >
    <Figma size="22" />
  </ButtonWindow>
  <ButtonTool padding={"0px 8px"} on:mouseup={onClickNewProject}>
    <Plus size="15" />
  </ButtonTool>
</div>

<style>
  .panel-left {
    display: flex;
    align-items: stretch;
  }
</style>
