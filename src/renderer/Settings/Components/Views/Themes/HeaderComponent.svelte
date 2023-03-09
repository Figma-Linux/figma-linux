<script lang="ts">
  import { ipcRenderer } from "electron";
  import { Button, Sync, Spiner } from "Common";

  import { themesLoaded } from "../../../store";

  function onThemeSync(event: MouseEvent) {
    ipcRenderer.send("syncThemes");
    themesLoaded.set(false);
  }
</script>

<Button
  on:mouseup={onThemeSync}
  size={32}
  round={3}
  margin={"0 4px 0 0"}
  hoverBgColor="var(--borders)"
>
  <Spiner spin={!$themesLoaded}>
    <Sync color="var(--text)" />
  </Spiner>
</Button>

<style>
</style>
