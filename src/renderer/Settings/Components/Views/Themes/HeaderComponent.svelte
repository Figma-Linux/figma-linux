<script lang="ts">
  import { Flex, Button, Sync, Spiner } from "Common";

  import { themesLoaded } from "../../../store";

  const api = window.settingsAPI;

  function onThemeSync() {
    api.syncThemes();
    themesLoaded.set(false);
  }
</script>

<Flex>
  <Button
    onClick={onThemeSync}
    size={32}
    round={3}
    margin={"0 4px 0 0"}
    hoverBgColor="var(--borders)"
  >
    <Spiner spin={!$themesLoaded}>
      <Sync color="var(--text)" />
    </Spiner>
  </Button>
  <Flex width="10px" />
</Flex>

<style>
</style>
