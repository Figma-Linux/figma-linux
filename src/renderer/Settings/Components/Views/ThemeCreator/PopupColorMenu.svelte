<script lang="ts">
  import { Popup, ListBox } from "Common";
  import { isValidColor, HexToRgb } from "Utils/Render";
  import { creatorTheme } from "../../../store";

  import MenuItem from "./MenuItem.svelte";

  interface PopupColorMenuProps {
    key?: string;
    color?: string;
    isOpen?: boolean;
    cornerX?: number;
    x?: number;
    y?: number;
  }

  let {
    key = $bindable(""),
    color = $bindable(""),
    isOpen = $bindable(false),
    cornerX = $bindable(0),
    x = $bindable(0),
    y = $bindable(0),
  }: PopupColorMenuProps = $props();

  let items = $state<Types.ThemeCreatorPopupMenuItem[]>([
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
  ]);

  function onItemClick(item: Types.ThemeCreatorPopupMenuItem) {
    item.handler();

    if (!item.disabled) {
      isOpen = false;
    }
  }

  function onCopyHex() {
    if (window.settingsAPI) {
      window.settingsAPI.clipboardWriteText(color);
    }
  }
  function onCopyRgb() {
    if (window.settingsAPI) {
      window.settingsAPI.clipboardWriteText(HexToRgb(color));
    }
  }
  function onPaste() {
    if (!window.settingsAPI) {
      return;
    }
    const value = window.settingsAPI.clipboardReadText();

    if (!isValidColor(value)) {
      return;
    }

    creatorTheme.setColor(key, value);
  }
</script>

<Popup bind:isOpen bind:cornerX bind:x bind:y bradius="3px">
  {#snippet popupButton()}
    <div></div>
  {/snippet}

  {#snippet popupBody()}
    <ListBox {items} border="0" padding="0" bradius="0" {onItemClick} />
  {/snippet}
</Popup>

<style>
</style>
