export const assertNever = (item: Menu.MenuItem | Menu.Items.MenuName) => {
  throw new Error(`unreachable ${item.type}`);
};

export const stringOfActionMenuItemName = (name: Menu.Items.MenuName) => {
  switch (name.type) {
    case "string-key":
      return name.string;
    case "plugin-name":
      return name.plugin;
    default:
      return assertNever(name);
  }
};

export const isStringKeyName = (data: any): boolean =>
  data.type === "string-key" && typeof data.key === "string" && typeof data.string === "string";

export const isRunInstalledPlugin = (data: any) => {
  return (
    data.type === "run-installed-plugin" &&
    typeof data.pluginId === "string" &&
    (data.command === undefined || typeof data.command === "string")
  );
};
export const isRunLocalPlugin = (data: any) => {
  return (
    data.type === "run-local-plugin" &&
    typeof data.localFileId === "number" &&
    (data.command === undefined || typeof data.command === "string")
  );
};
export const isRunLastPlugin = (data: any) => {
  return data.type === "run-last";
};
export const isManagePlugins = (data: any) => {
  return data.type === "manage";
};
export const isNewPlugin = (data: any) => {
  return data.type === "create-new";
};
export const isInternalDev = (data: any) => {
  return data.type === "internal-dev";
};
export const isOpenConsole = (data: any) => {
  return data.type === "open-console" && (data.showError === undefined || typeof data.showError === "string");
};
export const isOpenExtensionDirectory = (data: any) => {
  return data.type === "open-dir" && typeof data.localFileId === "number";
};

export const isPluginMenuAction = (data: any) => {
  return isRunInstalledPlugin(data) || isRunLocalPlugin(data);
};
export const isStaticMenuAction = (data: any) => {
  return (
    isRunLastPlugin(data) ||
    isManagePlugins(data) ||
    isNewPlugin(data) ||
    isOpenConsole(data) ||
    isInternalDev(data) ||
    isOpenExtensionDirectory(data)
  );
};

export const isMenuAction = (data: any) => {
  return isPluginMenuAction(data) || isStaticMenuAction(data);
};

export const isPluginName = (data: any): boolean => data.type === "plugin-name" && typeof data.plugin === "string";

export const isActionMenuItemName = (data: Menu.Items.MenuName): boolean => isStringKeyName(data) || isPluginName(data);

export const isActionMenuItem = (data: Menu.MenuItem): boolean =>
  data.type === "run-menu-action" &&
  isActionMenuItemName(data.name) &&
  (data.menuAction === undefined || isMenuAction(data.menuAction)) &&
  (data.disabled === undefined || typeof data.disabled === "boolean");

export const isSeparatorMenuItem = (data: Menu.MenuItem): boolean => data.type === "separator";

export const isSubmenuMenuItem = (data: Menu.MenuItem): boolean =>
  data.type === "submenu" &&
  typeof data.name === "string" &&
  Array.isArray(data.submenu) &&
  data.submenu.every(isMenuItem);

export const isMenuItem = (data: Menu.MenuItem): boolean => {
  return isActionMenuItem(data) || isSeparatorMenuItem(data) || isSubmenuMenuItem(data);
};
