<script lang="ts">
  import { Figma, Plus } from "Icons";
  import { ButtonWindow, ButtonTool } from "Common/Buttons";
  import { newFileVisible } from "../store";
  import { onClickHome, onClickNewProject } from "./utils";

  export let currentTabId: number | undefined;

  let isActive = false;

  $: isActive = currentTabId === undefined;
</script>

<div class="panel-left">
  <ButtonWindow
    padding={"0px 10px"}
    hoverBgColor={"var(--bg-tab-hover)"}
    activeBgColor={"var(--bg-tab-hover)"}
    {isActive}
    on:buttonClick={onClickHome}
  >
    <Figma size="22" />
  </ButtonWindow>
  {#if $newFileVisible}
    <ButtonTool padding={"0px 8px"} on:buttonClick={onClickNewProject}>
      <Plus size="15" />
    </ButtonTool>
  {/if}
</div>

<style>
  .panel-left {
    display: flex;
    align-items: stretch;
  }
</style>
