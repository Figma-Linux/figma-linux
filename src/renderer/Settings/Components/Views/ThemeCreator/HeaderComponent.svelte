<script lang="ts">
  import { ipcRenderer } from "electron";
  import { SecondaryButton, Flex } from "Common";

  function onReset(event: MouseEvent) {
    ipcRenderer.send("onReset");
  }
  function onSave(event: MouseEvent) {
    ipcRenderer.send("onSave");
  }
  function onAddToThemes(event: MouseEvent) {
    ipcRenderer.send("onAddToThemes");
  }
  function onExport(event: MouseEvent) {
    ipcRenderer.send("onExport");
  }
</script>

<Flex>
  <SecondaryButton height="28px">Reset</SecondaryButton>
  <Flex width="10px" />
  <SecondaryButton height="28px">Save</SecondaryButton>
  <Flex width="10px" />
  <SecondaryButton height="28px">Add to themes</SecondaryButton>
  <Flex width="10px" />
  <SecondaryButton height="28px">Export</SecondaryButton>
  <Flex width="20px" />
</Flex>

<style>
</style>
