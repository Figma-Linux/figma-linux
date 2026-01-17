import { resolve } from "path";

export const panelUrlDev = `http://localhost:${process.env.DEV_PANEL_PORT ?? 3330}`;
export const settingsUrlDev = `http://localhost:${process.env.DEV_SETTINGS_PORT ?? 3331}`;

export const panelUrlProd = `file://${resolve(__dirname, "../index.html")}`;
export const settingsUrlProd = `file://${resolve(__dirname, "../settings.html")}`;

// Legacy preload scripts (for webBinding injection into Figma web)
export const preloadMainScriptPathDev = `${resolve(
  process.cwd(),
  "dist/renderer",
  "loadMainContent.js",
)}`;
export const preloadMainScriptPathProd = `${resolve(
  __dirname,
  "..",
  "renderer",
  "loadMainContent.js",
)}`;
export const preloadScriptPathDev = `${resolve(process.cwd(), "dist/renderer", "loadContent.js")}`;
export const preloadScriptPathProd = `${resolve(__dirname, "..", "renderer", "loadContent.js")}`;

// New secure preload scripts with contextBridge
export const preloadPanelPathDev = `${resolve(process.cwd(), "dist/preload", "panel.js")}`;
export const preloadPanelPathProd = `${resolve(__dirname, "..", "preload", "panel.js")}`;
export const preloadSettingsPathDev = `${resolve(process.cwd(), "dist/preload", "settings.js")}`;
export const preloadSettingsPathProd = `${resolve(__dirname, "..", "preload", "settings.js")}`;
export const preloadTabPathDev = `${resolve(process.cwd(), "dist/preload", "tab.js")}`;
export const preloadTabPathProd = `${resolve(__dirname, "..", "preload", "tab.js")}`;

export const isFigmaValidUrl = (url: string): boolean => {
  return /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com)/.test(url);
};
