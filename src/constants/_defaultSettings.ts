export const DEFAULT_SETTINGS: SettingsInterface = {
  app: {
    panelHeight: 40,
    showMainMenu: false,
    disabledMainMenu: false,
    saveLastOpenedTabs: true,
    windowFrame: false,
    disabledFonts: false,
    exportDir: `${process.env.HOME}/Pictures/Figma`,
    fontDirs: ["/usr/share/fonts", "/usr/local/share/fonts", `${process.env.HOME}/.local/share/fonts`],
    lastOpenedTabs: [],
  },
  theme: {
    currentTheme: "0",
  },
  ui: {
    scalePanel: 1,
    scaleFigmaUI: 1,
  },
};
