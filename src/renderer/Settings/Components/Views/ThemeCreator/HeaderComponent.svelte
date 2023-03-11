<script lang="ts">
  import { ipcRenderer } from "electron";
  import { SecondaryButton, Flex } from "Common";

  import { themesLoaded } from "../../../store";

  function onAddToThemes(event: MouseEvent) {
    ipcRenderer.send("syncThemes");
    themesLoaded.set(false);
  }
  function onExport(event: MouseEvent) {
    ipcRenderer.send("syncThemes");
    themesLoaded.set(false);
  }
</script>

<Flex>
  <SecondaryButton height="28px">Add to themes</SecondaryButton>
  <Flex width="10px" />
  <SecondaryButton height="28px">Export</SecondaryButton>
  <Flex width="20px" />
</Flex>

<style>
</style>
