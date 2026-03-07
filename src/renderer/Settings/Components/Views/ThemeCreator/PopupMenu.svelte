<script lang="ts">
  import { untrack } from "svelte";
  import type { Snippet } from "svelte";
  import { Popup, ListBox } from "Common";
  import { Download, Plus, Reset, Save2 } from "Common/Icons";
  import { validateThemeName, validateThemeAuthor } from "../../../validators";
  import { creatorTheme, creatorsThemes, themes } from "../../../store";

  import MenuItem from "./MenuItem.svelte";

  interface PopupMenuProps {
    children?: Snippet;
  }

  let { children }: PopupMenuProps = $props();

  const api = window.settingsAPI;

  let isOpen = $state(false);

  let items = $state<Types.ThemeCreatorPopupMenuItem[]>([
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
      id: "resetTmp",
      text: "Reset Template",
      itemArgs: {
        Icon: Reset,
      },
      handler: onResetTemplate,
      item: MenuItem,
    },
    {
      id: "save",
      text: "Save",
      disabled: true,
      itemArgs: {
        Icon: Save2,
      },
      handler: onAddToThemes,
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
  ]);

  $effect(() => {
    // Read the reactive values we want to track
    const state = $creatorTheme.state;
    const loadedTemplateId = $creatorTheme.loadedTemplateId;

    // Use untrack to prevent reading items from triggering the effect again
    untrack(() => {
      items = items.map((item) => {
        if (item.id === "save") {
          item.disabled = state !== "edit";
        }
        if (item.id === "resetTmp") {
          item.disabled = loadedTemplateId === "";
        }
        return item;
      });
    });
  });

  function onItemClick(item: Types.ThemeCreatorPopupMenuItem) {
    item.handler();

    if (!item.disabled) {
      isOpen = false;
    }
  }

  function onReset() {
    creatorTheme.reset();
  }
  function onResetTemplate() {
    const themeId = $creatorTheme.loadedTemplateId;
    const theme: Themes.Theme = structuredClone(
      [...$themes, ...$creatorsThemes].find((theme) => theme.id === themeId),
    );

    creatorTheme.setPaletteTheme(theme);
  }
  function onAddToThemes() {
    if (!validateThemeName($creatorTheme.theme.name)) {
      return;
    }
    if (!validateThemeAuthor($creatorTheme.theme.author)) {
      return;
    }

    api.themeCreatorAddTheme($creatorTheme.theme);

    creatorTheme.reset();
  }
  function onExport() {
    if (!validateThemeName($creatorTheme.theme.name)) {
      return;
    }
    if (!validateThemeAuthor($creatorTheme.theme.author)) {
      return;
    }

    api.themeCreatorExportTheme($creatorTheme.theme.id);
  }
</script>

<Popup bind:isOpen bradius="3px">
  {#snippet popupButton()}
    {@render children?.()}
  {/snippet}

  {#snippet popupBody()}
    <ListBox {items} border="0" padding="0" bradius="0" {onItemClick} />
  {/snippet}
</Popup>

<style>
</style>
