import * as E from "electron";

import Commander from "Main/Commander";
import { LINKS } from "Const";
import { item, commandToMainProcess, handleUrl } from "Utils/Main";

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
        Commander.exec("sign-out");
      },
    },
    { type: "separator" },
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
      accelerator: "Shift+Ctrl+Alt+S",
      click(item, window): void {
        Commander.exec("toggle-settings-developer-tools", item, window);
      },
    },
    item("GPU", "", { id: "chrome://gpu", click: commandToMainProcess }),
  ],
} as E.MenuItemConstructorOptions;

export const getMenuTemplate = (pluginMenuItems?: any[]): E.MenuItemConstructorOptions[] => {
  const menu: E.MenuItemConstructorOptions[] = [
    item("New File", "Ctrl+N", { id: "newFile", click: commandToMainProcess }),
    item("Open File Browser", "Ctrl+O", { id: "openFileBrowser", click: commandToMainProcess }),
    item("Open File URL from Clipboard", "Ctrl+O", { id: "openFileUrlClipboard", click: commandToMainProcess }),
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
