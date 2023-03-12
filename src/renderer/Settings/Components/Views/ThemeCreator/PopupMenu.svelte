<script lang="ts">
  import { Popup, ListBox } from "Common";
  import { Download, Plus, Reset, Save2 } from "Common/Icons";
  import MenuItem from "./MenuItem.svelte";

  const items = [
    {
      id: "reset",
      text: "Reset",
      itemArgs: {
        Icon: Reset,
      },
      item: MenuItem,
    },
    {
      id: "save",
      text: "Save",
      itemArgs: {
        Icon: Save2,
      },
      item: MenuItem,
    },
    {
      id: "add_to_themes",
      text: "Add to themes",
      itemArgs: {
        Icon: Plus,
      },
      item: MenuItem,
    },
    {
      id: "export",
      text: "Export",
      itemArgs: {
        Icon: Download,
      },
      item: MenuItem,
    },
  ];

  function onReset(event: MouseEvent) {
    console.log("onReset");
  }
  function onSave(event: MouseEvent) {
    console.log("onSave");
  }
  function onAddToThemes(event: MouseEvent) {
    console.log("onAddToThemes");
  }
  function onExport(event: MouseEvent) {
    console.log("onExport");
  }
  function onMenu(event: MouseEvent) {
    console.log("onMenu");
  }
</script>

<Popup bradius="3px">
  <slot slot="popupButon" />

  <ListBox {items} slot="popupBody" border="0" padding="0" bradius="0" />
</Popup>

<style>
</style>
