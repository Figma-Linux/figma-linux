<script lang="ts">
  import { ButtonTool, ButtonWindow } from "Common/Buttons";
  import { Community, Figma, Plus } from "Icons";
  import { communityTabVisible, currentTab, newFileVisible } from "../store";
  import { onClickCommunity, onClickHome, onClickNewProject } from "./utils";


  const sizesIcons = {
    figma: 24,
    community: 20,
    plus: 16
  };
</script>

<div class="panel-left">
  <ButtonWindow
    padding={"0px 10px"}
    hoverBgColor={"var(--bg-tab-hover)"}
    activeBgColor={"var(--bg-tab-hover)"}
    isActive={$currentTab === "mainTab"}
    on:buttonClick={onClickHome}
  >
    <Figma size={`${String(sizesIcons.figma)}`} />
  </ButtonWindow>

  {#if $communityTabVisible}
    <ButtonWindow
      padding={"0px 10px"}
      hoverBgColor={"var(--bg-tab-hover)"}
      activeBgColor={"var(--bg-tab-hover)"}
      isActive={$currentTab === "communityTab"}
      on:buttonClick={onClickCommunity}
    >
      <Community size={`${String(sizesIcons.community)}`} />
    </ButtonWindow>
  {/if}
  {#if $newFileVisible}
    <ButtonTool padding={"0px 8px"} on:buttonClick={onClickNewProject}>
      <Plus size={`${String(sizesIcons.plus)}`} />
    </ButtonTool>
  {/if}
</div>

<style>
  .panel-left {
    display: flex;
    align-items: stretch; 
  }
</style>
