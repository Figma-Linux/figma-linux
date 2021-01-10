import * as E from "electron";

import { LINKS } from "Const";
import { item, commandToMainProcess, handleUrl, toggleDetachedDevTools } from "Utils/Main";

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
        E.shell.openExternal(LINKS.HELP_PAGE);
      },
    },
    {
      label: "Plugins documentation",
      click(item, window): void {
        if (!window) {
          return;
        }

        E.shell.openExternal(LINKS.PLUGINS_DOCS);
      },
    },
    {
      label: "Community Forum",
      click(): void {
        E.shell.openExternal(LINKS.FIGMA_COMMUNITY_FORUM);
      },
    },
    {
      label: "Figma Linux Community Forum",
      click(): void {
        E.shell.openExternal(LINKS.FIGMA_LINUX_COMMUNITY_FORUM);
      },
    },
    {
      label: "Figma Linux in Telegram",
      click(): void {
        E.shell.openExternal(LINKS.FIGMA_LINUX_TELEGRAM);
      },
    },
    {
      label: "Figma Linux Themes",
      click(): void {
        E.shell.openExternal(LINKS.THEMES_REPO);
      },
    },
    {
      label: "Video Tutorials",
      click(): void {
        E.shell.openExternal(LINKS.VIDEO_TUTORIALS);
      },
    },
    {
      label: "Release Notes",
      click(): void {
        E.shell.openExternal(LINKS.RELEASE_NOTES);
      },
    },
    {
      label: "Legal Summary",
      click(): void {
        E.shell.openExternal(LINKS.LEGAL_SUMMARY);
      },
    },
    { type: "separator" },
    {
      label: "Sign Out",
      click(): void {
        E.app.emit("sign-out");
      },
    },
    { type: "separator" },
    {
      label: "Toggle Developer Tools",
      accelerator: "Ctrl+Alt+I",
      click(): void {
        E.app.emit("toggle-current-tab-devtools");
      },
    },
    {
      label: "Toggle Window Developer Tools",
      accelerator: "Shift+Ctrl+Alt+I",
      click(_, window): void {
        if (!window) {
          return;
        }

        toggleDetachedDevTools(window.webContents);
      },
    },
    {
      label: "Toggle Additional Developer Tools",
      accelerator: "Shift+Ctrl+Alt+S",
      click(): void {
        E.app.emit("toggle-settings-developer-tools");
      },
    },
    item("GPU", "", { id: "chrome://gpu", click: commandToMainProcess }),
  ],
} as E.MenuItemConstructorOptions;

export const getMenuTemplate = (pluginMenuItems?: any[]): E.MenuItemConstructorOptions[] => {
  const menu: E.MenuItemConstructorOptions[] = [
    item("New File", "Ctrl+N", { id: "newFile", click: commandToMainProcess }),
    item("Open File Browser", "Ctrl+O", { id: "openFileBrowser", click: commandToMainProcess }),
    item("Open File URL from Clipboard", "Ctrl+Shift+O", { id: "openFileUrlClipboard", click: commandToMainProcess }),
    { type: "separator" },
    item("Close Tab", "Ctrl+W", { id: "closeTab", click: commandToMainProcess }),
    item("Reopen Closed Tab", "Ctrl+Shift+T", { id: "reopenClosedTab", click: commandToMainProcess }),
    { type: "separator" },
  ];

  if (pluginMenuItems && pluginMenuItems.length > 0) {
    menu.push({
      label: "Plugins",
      submenu: pluginMenuItems,
    });
  } else {
    menu.push(PLUGINS_MENU);
    menu.push({ type: "separator" });
  }

  menu.push({
    label: "Theme Creator",
    click: () => {
      E.app.emit("openThemeCreatorView");
    },
  });
  menu.push({
    label: "Settings",
    click: () => {
      E.app.emit("openSettingsView");
    },
  });
  menu.push(HELP_MENU);

  menu.push({ type: "separator" });
  menu.push({
    label: "Exit",
    click: () => {
      E.app.quit();
    },
  });

  return menu;
};
