<script lang="ts">
  import { ipcRenderer } from "electron";
  import { HeaderModal, HeaderText, Button, CloseModal, FlexGrow } from "Common";

  function onSettingsClose() {
    ipcRenderer.send("closeSettingsView");
  }
</script>

<div>
  <HeaderModal>
    <FlexGrow grow={1}>
      <HeaderText>Setting page</HeaderText>
    </FlexGrow>
    <Button size={32} round={3} on:mouseup={onSettingsClose}>
      <CloseModal />
    </Button>
  </HeaderModal>
</div>

<style>
  div {
    width: 90vw;
    height: 80vh;
    overflow: hidden;
    background: var(--bg-panel);
    border: 1px solid var(--borders);
  }
</style>
