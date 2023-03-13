<script lang="ts">
  import { ipcRenderer } from "electron";
  import { Popup, ListBox } from "Common";
  import { Download, Plus, Reset, Save2 } from "Common/Icons";
  import { creatorTheme } from "../../../store";

  import MenuItem from "./MenuItem.svelte";

  let isOpen = false;

  let items: Types.ThemeCreatorPopupMenuItem[] = [
    {
      id: "reset",
      text: "Reset",
      itemArgs: {
        Icon: Reset,
      },
      handler: onReset,
      item: MenuItem,
    },
    {
      id: "save",
      text: "Save",
      disabled: true,
      itemArgs: {
        Icon: Save2,
      },
      handler: onSave,
      item: MenuItem,
    },
    {
      id: "add_to_themes",
      text: "Add to themes",
      itemArgs: {
        Icon: Plus,
      },
      handler: onAddToThemes,
      item: MenuItem,
    },
    {
      id: "export",
      text: "Export",
      itemArgs: {
        Icon: Download,
      },
      handler: onExport,
      item: MenuItem,
    },
  ];

  $: {
    items = items.map((item) => {
      if (item.id === "save") {
        item.disabled = $creatorTheme.state !== "edit";
      }
      return item;
    });
  }

  function onItemClick(item: Types.ThemeCreatorPopupMenuItem) {
    item.handler();

    if (!item.disabled) {
      isOpen = false;
    }
  }

  function onReset() {
    console.log("onReset");
  }
  function onSave() {
    // TODO: check name and author
    ipcRenderer.send("themeCreatorAddTheme", $creatorTheme.theme);

    creatorTheme.reset();
  }
  function onAddToThemes() {
    // TODO: check name and author
    ipcRenderer.send("themeCreatorAddTheme", $creatorTheme.theme);
  }
  function onExport() {
    // TODO: check name and author
    ipcRenderer.send("themeCreatorExportTheme", $creatorTheme.theme);
  }
</script>

<Popup bind:isOpen bradius="3px">
  <slot slot="popupButon" />

  <ListBox bind:items slot="popupBody" border="0" padding="0" bradius="0" {onItemClick} />
</Popup>

<style>
</style>
