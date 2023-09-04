import { app, BrowserWindow, MenuItemConstructorOptions } from "electron";

export const item = (label: string, accelerator: string, params: MenuItemConstructorOptions) => {
  const props: MenuItemConstructorOptions = {
    label,
    enabled: true,
    ...params,
  };

  if (accelerator) {
    props.accelerator = accelerator;
  }

  return props;
};

export const commandToMainProcess = (item: Menu.PluginMenuItem, window: BrowserWindow) => {
  app.emit(item.id, window.webContents);
};

export const handleUrl = (url: string) => {
  app.emit("handleUrl", url);
};
