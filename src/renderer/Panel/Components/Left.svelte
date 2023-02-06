<script lang="ts">
  import { ipcRenderer } from "electron";
  import { Figma, Plus } from "Icons";
  import { ButtonHome, ButtonControlHover } from "Common/Buttons";
</script>

<div class="panel-left">
  <ButtonHome onClick={() => ipcRenderer.send("setFocusToMainTab")}>
    <Figma size="22" />
  </ButtonHome>
  <ButtonControlHover onClick={() => ipcRenderer.send("newProject")}>
    <Plus size="15" />
  </ButtonControlHover>
</div>

<style>
  .panel-left {
    display: flex;
    align-items: stretch;
  }
</style>
