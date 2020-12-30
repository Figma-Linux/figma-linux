import * as E from "electron";

import Commander from "Main/Commander";
import { item, commandToMainProcess, handleCommandItemClick, handleItemAction, handleUrl } from "Utils/Main";

const SEPARATOR = { type: "separator" };
const FILE_MENU = {
  label: "File",
  submenu: [
    item("New File", "Ctrl+N", { id: "newFile", click: commandToMainProcess }),
    item("Open File Browser", "Ctrl+O", { id: "openFileBrowser", click: commandToMainProcess }),
    item("Reopen Closed Tab", "Ctrl+Shift+T", { id: "reopenClosedTab", click: commandToMainProcess }),
    SEPARATOR,
    {
      label: "Close Window",
      accelerator: "Ctrl+Shift+W",
      click() {
        Commander.exec("close-window");
      },
    },
    item("Close Tab", "Ctrl+W", { id: "closeTab", click: commandToMainProcess }),
    SEPARATOR,
    item("Save As .fig...", "Ctrl+Shift+S", { id: "save-as", click: handleItemAction }),
    item("Export...", "Ctrl+Shift+E", { id: "export-selected-exportables", click: handleItemAction }),
    SEPARATOR,
    item("Settings", "", { id: "openSettings", click: commandToMainProcess }),
    { role: "quit" },
  ],
} as E.MenuItemConstructorOptions;
const EDIT_MENU = {
  label: "Edit",
  submenu: [
    item("Undo", "Ctrl+Z", { id: "undo", click: handleCommandItemClick }),
    item("Redo", "Control+Y", { id: "redo", click: handleCommandItemClick }),
    SEPARATOR,
    { role: "cut" },
    { role: "copy" },
    { role: "paste" },
    item("Paste Over Selection", "Shift+Ctrl+V", { id: "paste-over-selection", click: handleItemAction }),
    SEPARATOR,
    item("Pick Color", "", { id: "toggle-dropper", click: handleItemAction }),
    SEPARATOR,
    item("Set Default Style", "Alt+Ctrl+X", { id: "set-default-style", click: handleItemAction }),
    item("Copy Properties", "Alt+Ctrl+C", { id: "copy-properties", click: handleItemAction }),
    item("Paste Properties", "Alt+Ctrl+V", { id: "paste-properties", click: handleItemAction }),
    SEPARATOR,
    item("Select All", "Ctrl+A", { id: "selectAll", click: handleCommandItemClick }),
    item("Select None", null, { id: "deselect-all", click: handleItemAction }),
    item("Select Inverse", "Shift+Ctrl+A", { id: "select-inverse", click: handleItemAction }),
    SEPARATOR,
    item("Select All with Same Style", null, { id: "select-same-style", click: handleItemAction }),
    item("Select All with Same Fill", null, { id: "select-same-fill", click: handleItemAction }),
    item("Select All with Same Stroke", null, { id: "select-same-stroke", click: handleItemAction }),
    item("Select All with Same Effect", null, { id: "select-same-effect", click: handleItemAction }),
    item("Select All with Same Text", null, { id: "select-same-text", click: handleItemAction }),
    item("Select All with Same Font", null, { id: "select-same-font", click: handleItemAction }),
    item("Select All with Same Instance", null, { id: "select-same-instance", click: handleItemAction }),
  ],
} as E.MenuItemConstructorOptions;
const VIEW_MENU = {
  label: "View",
  submenu: [
    item("Show Pixel Grid", "Ctrl+'", { id: "toggle-grid", click: handleItemAction }),
    item("Show Layout Grids", "Ctrl+Shift+4", { id: "toggle-shown-layout-grids", click: handleItemAction }),
    item("Show Mask Outlines", null, { id: "toggle-show-masks", click: handleItemAction }),
    item("Frame Outlines", null, { id: "toggle-show-artboard-outlines", click: handleItemAction }),
    item("Show Rulers", "", { id: "toggle-rulers", click: handleItemAction }),
    item("Show Layers Panel", "Ctrl+Shift+\\", { id: "toggle-sidebar", click: handleItemAction }),
    item("Show UI", "Ctrl+\\", { id: "toggle-ui", click: handleItemAction }),
    item("Show Outlines", "Ctrl+Shift+3", { id: "toggle-outlines", click: handleItemAction }),
    SEPARATOR,
    item("Switch to Layers", "Alt+1", { id: "toggle-layers", click: handleItemAction }),
    item("Switch to Components", "Alt+2", { id: "toggle-publish", click: handleItemAction }),
    item("Switch to Team Library", "Alt+3", { id: "toggle-library", click: handleItemAction }),
    SEPARATOR,
    item("Pixel Preview", "Control+Alt+Y", { id: "toggle-pixel-preview", click: handleItemAction }),
    item("Show Transparency Checkerboard", "Alt+Shift+'", { id: "toggle-checkerboard", click: handleItemAction }),
    SEPARATOR,
    item("Zoom In", "", { id: "zoom-in", click: handleItemAction }),
    item("Zoom Out", "", { id: "zoom-out", click: handleItemAction }),
    item("Zoom to 100%", "", { id: "zoom-reset", click: handleItemAction }),
    item("Zoom to Fit", "", { id: "zoom-to-fit", click: handleItemAction }),
    item("Zoom to Selection", "", { id: "zoom-to-selection", click: handleItemAction }),
    SEPARATOR,
    item("Scale UI Normal", "Ctrl+Shift+Backspace", { id: "scale-normal", click: commandToMainProcess }),
    item("Scale UI + 10%", "Ctrl+=", { id: "scale-inc0.1", click: commandToMainProcess }),
    item("Scale UI - 10%", "Ctrl+-", { id: "scale-dic0.1", click: commandToMainProcess }),
    item("Scale UI + 5%", "Ctrl+Shift+=", { id: "scale-inc0.05", click: commandToMainProcess }),
    item("Scale UI - 5%", "Ctrl+Shift+-", { id: "scale-dic0.05", click: commandToMainProcess }),
    SEPARATOR,
    item("Find Next Frame", "", { id: "next-artboard", click: handleItemAction }),
    item("Find Previous Frame", "", { id: "previous-artboard", click: handleItemAction }),
    SEPARATOR,
    { role: "togglefullscreen" },
  ],
} as E.MenuItemConstructorOptions;
const OBJECT_MENU = {
  label: "Object",
  submenu: [
    item("Group Selection", "Ctrl+G", { id: "group-selection", click: handleItemAction }),
    item("Ungroup Selection", "Shift+Ctrl+G", { id: "ungroup-selection", click: handleItemAction }),
    item("Frame Selection", "Ctrl+Alt+G", { id: "frame-selection", click: handleItemAction }),
    item("Use as Mask", "Alt+Ctrl+M", { id: "mask-selection", click: handleItemAction }),
    SEPARATOR,
    item("Create Component", "Ctrl+Alt+K", { id: "create-symbol", click: handleItemAction }),
    item("Go to Master Component", null, { id: "find-symbol", click: handleItemAction }),
    item("Reset Instance", null, { id: "reset-symbol", click: handleItemAction }),
    item("Detach Instance", "Ctrl+Alt+B", { id: "detach-instance", click: handleItemAction }),
    item("Resize to Fit", null, { id: "resize-to-fit", click: handleItemAction }),
    item("Toggle Clipping", null, { id: "toggle-frame-clipping", click: handleItemAction }),
    SEPARATOR,
    item("Bring to Front", "Ctrl+Shift+]", { id: "bring-to-front", click: handleItemAction }),
    item("Bring Forward", "Ctrl+]", { id: "bring-forward", click: handleItemAction }),
    item("Send Backward", "Ctrl+[", { id: "send-backward", click: handleItemAction }),
    item("Send to Back", "Ctrl+Shift+[", { id: "send-to-back", click: handleItemAction }),
    SEPARATOR,
    item("Flip Horizontal", "", { id: "flip-horizontal", click: handleItemAction }),
    item("Flip Vertical", "", { id: "flip-vertical", click: handleItemAction }),
    // item('Flip Horizontal', 'Shift+H', { action: 'flip-horizontal', click: handleItemAction }),
    // item('Flip Vertical', 'Shift+V', { action: 'flip-vertical', click: handleItemAction }),
    SEPARATOR,
    item("Rotate 180˚", null, { id: "rotate-180", click: handleItemAction }),
    item("Rotate 90˚ Left", null, { id: "rotate-90-counterclockwise", click: handleItemAction }),
    item("Rotate 90˚ Right", null, { id: "rotate-90-clockwise", click: handleItemAction }),
    SEPARATOR,
    item("Flatten Selection", "Ctrl+E", { id: "flatten-selection", click: handleItemAction }),
    item("Outline Stroke", "Shift+Ctrl+O", { id: "outline-stroke", click: handleItemAction }),
    {
      label: "Boolean Groups",
      submenu: [
        item("Union Selection", null, { id: "live-boolean-union", click: handleItemAction }),
        item("Subtract Selection", null, { id: "live-boolean-subtract", click: handleItemAction }),
        item("Intersect Selection", null, { id: "live-boolean-intersect", click: handleItemAction }),
        item("Exclude Selection", null, { id: "live-boolean-xor", click: handleItemAction }),
      ],
    },
    SEPARATOR,
    item("Duplicate Selection in Place", "Ctrl+D", { id: "duplicate-in-place", click: handleItemAction }),
    item("Delete Selection", "Backspace", { id: "delete-selection", click: handleItemAction }),
    item("Rasterize Selection", null, { id: "convert-to-raster", click: handleItemAction }),
    SEPARATOR,
    item("Show/Hide Selection", "Shift+Ctrl+H", { id: "toggle-shown-for-selected-nodes", click: handleItemAction }),
    item("Lock/Unlock Selection", "Shift+Ctrl+L", {
      id: "toggle-locked-for-selected-nodes",
      click: handleItemAction,
    }),
    item("Hide Other Layers", null, { id: "hide-sibling-layers", click: handleItemAction }),
    item("Collapse Layers", "Alt+L", { id: "collapse-layers", click: handleItemAction }),
    SEPARATOR,
    item("Remove Fill", "Alt+/", { id: "remove-fill", click: handleItemAction }),
    item("Remove Stroke", "/", { id: "remove-stroke", click: handleItemAction }),
    item("Swap Fill and Stroke", "", { id: "swap-fill-and-stroke", click: handleItemAction }),
    // item('Swap Fill and Stroke', 'Shift+X', { action: 'swap-fill-and-stroke', click: handleItemAction }),
  ],
} as E.MenuItemConstructorOptions;
const VECTOR_MENU = {
  label: "Vector",
  submenu: [
    item("Join Selection", "Ctrl+J", { id: "join-selection", click: handleItemAction }),
    item("Smooth Join Selection", null, { id: "smooth-join-selection", click: handleItemAction }),
    item("Delete and Heal Selection", "Shift+Backspace", {
      id: "delete-and-heal-selection",
      click: handleItemAction,
    }),
  ],
} as E.MenuItemConstructorOptions;
const TEXT_MENU = {
  label: "Text",
  submenu: [
    item("Toggle Bold", "Ctrl+B", { id: "text-toggle-bold", click: handleItemAction }),
    item("Toggle Italic", "Ctrl+I", { id: "text-toggle-italic", click: handleItemAction }),
    item("Toggle Underline", "Ctrl+U", { id: "text-toggle-underline", click: handleItemAction }),
    item("Toggle Strikethrough", null, { id: "text-toggle-strikethrough", click: handleItemAction }),
    SEPARATOR,
    item("Text Original Case", null, { id: "text-original-case", click: handleItemAction }),
    item("Text Upper Case", null, { id: "text-upper-case", click: handleItemAction }),
    item("Text Lower Case", null, { id: "text-lower-case", click: handleItemAction }),
  ],
} as E.MenuItemConstructorOptions;
const ARRANGE_MENU = {
  label: "Arrange",
  submenu: [
    item("Round to Pixels", null, { id: "round-to-pixels", click: handleItemAction }),
    SEPARATOR,
    item("Align Left", null, { id: "align-left", click: handleItemAction }),
    item("Align Horizontal Centers", null, { id: "align-horizontal-center", click: handleItemAction }),
    item("Align Right", null, { id: "align-right", click: handleItemAction }),
    item("Align Top", null, { id: "align-top", click: handleItemAction }),
    item("Align Vertical Centers", null, { id: "align-vertical-center", click: handleItemAction }),
    item("Align Bottom", null, { id: "align-bottom", click: handleItemAction }),
    SEPARATOR,
    item("Pack Horizontal", null, { id: "pack-horizontal", click: handleItemAction }),
    item("Pack Vertical", null, { id: "pack-vertical", click: handleItemAction }),
    SEPARATOR,
    item("Distribute Horizontal Spacing", "Ctrl+Alt+Control+H", {
      id: "distribute-horizontal-spacing",
      click: handleItemAction,
    }),
    item("Distribute Vertical Spacing", "Ctrl+Alt+Control+V", {
      id: "distribute-vertical-spacing",
      click: handleItemAction,
    }),
    SEPARATOR,
    item("Distribute Left", null, { id: "distribute-left", click: handleItemAction }),
    item("Distribute Horizontal Centers", null, { id: "distribute-horizontal-center", click: handleItemAction }),
    item("Distribute Right", null, { id: "distribute-right", click: handleItemAction }),
    item("Distribute Top", null, { id: "distribute-top", click: handleItemAction }),
    item("Distribute Vertical Centers", null, { id: "distribute-vertical-center", click: handleItemAction }),
    item("Distribute Bottom", null, { id: "distribute-bottom", click: handleItemAction }),
  ],
} as E.MenuItemConstructorOptions;

const PLUGINS_MENU = {
  label: "Plugins",
  submenu: [
    {
      label: "Manage plugins...",
      click(item, window): void {
        if (!window) {
          return;
        }

        handleUrl(window, "/my_plugins");
      },
    },
  ],
} as E.MenuItemConstructorOptions;

const HELP_MENU = {
  role: "help",
  submenu: [
    {
      label: "Help Page",
      click(): void {
        E.shell.openExternal("https://help.figma.com");
      },
    },
    {
      label: "Community Forum",
      click(): void {
        E.shell.openExternal("https://spectrum.chat/figma");
      },
    },
    {
      label: "Video Tutorials",
      click(): void {
        E.shell.openExternal("https://www.youtube.com/playlist?list=PLXDU_eVOJTx4HJKh8tQkQRtIe5YlP5smB");
      },
    },
    {
      label: "Release Notes",
      click(): void {
        E.shell.openExternal("http://releases.figma.com");
      },
    },
    {
      label: "Legal Summary",
      click(): void {
        E.shell.openExternal("https://www.figma.com/summary-of-policy");
      },
    },
    SEPARATOR,
    {
      label: "Sign Out",
      click(): void {
        Commander.exec("sign-out");
      },
    },
    SEPARATOR,
    {
      label: "Toggle Developer Tools",
      accelerator: "Ctrl+Alt+I",
      click(item, window): void {
        Commander.exec("toggle-developer-tools", item, window);
      },
    },
    {
      label: "Toggle Window Developer Tools",
      accelerator: "Shift+Ctrl+Alt+I",
      click(item, window): void {
        Commander.exec("toggle-window-developer-tools", item, window);
      },
    },
    {
      label: "Toggle Settings Developer Tools",
      click(item, window): void {
        Commander.exec("toggle-settings-developer-tools", item, window);
      },
    },
    item("GPU", "", { id: "chrome://gpu", click: commandToMainProcess }),
  ],
} as E.MenuItemConstructorOptions;

export const getMenuTemplate = (pluginMenuItems?: any[]): E.MenuItemConstructorOptions[] => {
  const menu: E.MenuItemConstructorOptions[] = [
    FILE_MENU,
    EDIT_MENU,
    VIEW_MENU,
    OBJECT_MENU,
    VECTOR_MENU,
    TEXT_MENU,
    ARRANGE_MENU,
  ];

  if (pluginMenuItems && pluginMenuItems.length > 0) {
    menu.push({
      label: "Plugins",
      submenu: pluginMenuItems,
    });
  } else {
    menu.push(PLUGINS_MENU);
  }

  menu.push(HELP_MENU);

  return menu;
};
