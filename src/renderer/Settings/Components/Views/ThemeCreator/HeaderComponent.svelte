<script lang="ts">
  import { ipcRenderer } from "electron";
  import { SecondaryButton, Button, Menu, Flex } from "Common";
  import PopupMenu from "./PopupMenu.svelte";
</script>

<Flex>
  <PopupMenu>
    <Button size={32} round={3} hoverBgColor="var(--borders)">
      <Menu color="var(--text)" />
    </Button>
  </PopupMenu>
  <Flex width="10px" />
</Flex>

<style>
</style>
