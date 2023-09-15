<script lang="ts">
  import { Figma, Community, Plus } from "Icons";
  import { ButtonWindow, ButtonTool } from "Common/Buttons";
  import { newFileVisible, communityTabVisible, currentTab } from "../store";
  import { onClickHome, onClickNewProject, onClickCommunity } from "./utils";
</script>

<div class="panel-left">
  <ButtonWindow
    padding={"0px 10px"}
    hoverBgColor={"var(--bg-tab-hover)"}
    activeBgColor={"var(--bg-tab-hover)"}
    isActive={$currentTab === "mainTab"}
    on:buttonClick={onClickHome}
  >
    <Figma size="22" />
  </ButtonWindow>

  {#if $communityTabVisible}
    <ButtonWindow
      padding={"0px 10px"}
      hoverBgColor={"var(--bg-tab-hover)"}
      activeBgColor={"var(--bg-tab-hover)"}
      isActive={$currentTab === "communityTab"}
      on:buttonClick={onClickCommunity}
    >
      <Community size="20" />
    </ButtonWindow>
  {/if}
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
