<script lang="ts">
  import { clipboard } from "electron";
  import { Popup, ListBox } from "Common";
  import { isValidColor, HexToRgb } from "Utils/Render";
  import { creatorTheme } from "../../../store";

  import MenuItem from "./MenuItem.svelte";

  export let key = "";
  export let color = "";
  export let isOpen = false;
  export let cornerX = 0;
  export let x = 0;
  export let y = 0;

  let items: Types.ThemeCreatorPopupMenuItem[] = [
    {
      id: "paste",
      text: "Paste color",
      handler: onPaste,
      item: MenuItem,
    },
    {
      id: "copyHex",
      text: "Copy as HEX",
      handler: onCopyHex,
      item: MenuItem,
    },
    {
      id: "copyRgb",
      text: "Copy as RGB",
      handler: onCopyRgb,
      item: MenuItem,
    },
  ];

  function onItemClick(item: Types.ThemeCreatorPopupMenuItem) {
    item.handler();

    if (!item.disabled) {
      isOpen = false;
    }
  }

  function onCopyHex() {
    clipboard.writeText(color);
  }
  function onCopyRgb() {
    clipboard.writeText(HexToRgb(color));
  }
  function onPaste() {
    const value = clipboard.readText();

    if (!isValidColor(value)) {
      return;
    }

    creatorTheme.setColor(key, value);
  }
</script>

<Popup bind:isOpen bind:cornerX bind:x bind:y bradius="3px">
  <div slot="popupButton" />

  <ListBox bind:items slot="popupBody" border="0" padding="0" bradius="0" {onItemClick} />
</Popup>

<style>
</style>
