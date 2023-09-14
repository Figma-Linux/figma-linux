import { app, shell, MenuItemConstructorOptions } from "electron";

import { LINKS } from "Const";
import { toggleDetachedDevTools } from "Utils/Main";
import { item, commandToMainProcess, handleUrl } from "Utils/Main";

const PLUGINS_MENU = {
  label: "Plugins",
  submenu: [
    {
      label: "Manage plugins...",
      click() {
        handleUrl("/my_plugins");
      },
    },
  ],
} as MenuItemConstructorOptions;

const HELP_MENU = {
  role: "help",
  submenu: [
    {
      label: "Help Page",
      click() {
        shell.openExternal(LINKS.HELP_PAGE);
      },
    },
    {
      label: "Plugins documentation",
      click(item, window) {
        if (!window) {
          return;
        }

        shell.openExternal(LINKS.PLUGINS_DOCS);
      },
    },
    {
      label: "Community Forum",
      click() {
        shell.openExternal(LINKS.FIGMA_COMMUNITY_FORUM);
      },
    },
    {
      label: "Figma Linux Community Forum",
      click() {
        shell.openExternal(LINKS.FIGMA_LINUX_COMMUNITY_FORUM);
      },
    },
    {
      label: "Figma Linux in Telegram",
      click() {
        shell.openExternal(LINKS.FIGMA_LINUX_TELEGRAM);
      },
    },
    {
      label: "Figma Linux Themes",
      click() {
        shell.openExternal(LINKS.THEMES_REPO);
      },
    },
    {
      label: "Video Tutorials",
      click() {
        shell.openExternal(LINKS.VIDEO_TUTORIALS);
      },
    },
    {
      label: "Release Notes",
      click() {
        shell.openExternal(LINKS.RELEASE_NOTES);
      },
    },
    {
      label: "Legal Summary",
      click() {
        shell.openExternal(LINKS.LEGAL_SUMMARY);
      },
    },
    { type: "separator" },
    {
      label: "Sign Out",
      click() {
        app.emit("signOut");
      },
    },
    { type: "separator" },
    {
      label: "Toggle Developer Tools",
      accelerator: "Ctrl+Alt+I",
      click() {
        app.emit("toggleCurrentTabDevTools");
      },
    },
    {
      label: "Toggle Window Developer Tools",
      accelerator: "Shift+Ctrl+Alt+I",
      click(_, window) {
        if (!window) {
          return;
        }

        toggleDetachedDevTools(window.webContents);
      },
    },
    {
      label: "Toggle Settings View Developer Tools",
      accelerator: "Shift+Ctrl+Alt+S",
      click() {
        app.emit("toggleSettingsDeveloperTools");
      },
    },
    // TODO: fix
    // item("GPU", "", { id: "chromeGpu", click: commandToMainProcess }),
  ],
} as MenuItemConstructorOptions;

export const getMenuTemplate = (pluginMenuItems?: any[]): MenuItemConstructorOptions[] => {
  const menu: MenuItemConstructorOptions[] = [
    item("New Window", "Ctrl+N", { id: "newWindow", click: commandToMainProcess }),
    item("Open File Browser", "Ctrl+O", { id: "openFileBrowser", click: commandToMainProcess }),
    item("Open File URL from Clipboard", "Ctrl+Shift+O", {
      id: "openFileUrlClipboard",
      click: commandToMainProcess,
    }),
    { type: "separator" },
    item("Close Tab", "Ctrl+W", { id: "closeTab", click: commandToMainProcess }),
    item("Reopen Closed Tab", "Ctrl+Shift+T", {
      id: "reopenClosedTab",
      click: commandToMainProcess,
    }),
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
      app.emit("openSettingsView");
    },
  });
  menu.push(HELP_MENU);

  menu.push({ type: "separator" });
  menu.push({
    label: "Exit",
    click: () => {
      app.emit("quitApp");
    },
  });

  return menu;
};
