export const DEFAULT_SETTINGS: SettingsInterface = {
  app: {
    panelHeight: 28,
    showMainMenu: false,
    disabledMainMenu: false,
    saveLastOpenedTabs: true,
    windowFrame: false,
    disabledFonts: false,
    exportDir: `${process.env.HOME}/Pictures/Figma`,
    fontDirs: ["/usr/share/fonts", `${process.env.HOME}/.local/share/fonts`],
    lastOpenedTabs: [],
  },
  ui: {
    scalePanel: 1,
    scaleFigmaUI: 1,
  },
};
