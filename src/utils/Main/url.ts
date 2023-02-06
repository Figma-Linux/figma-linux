import { resolve } from "path";

export const panelUrlDev = `http://localhost:${process.env.DEV_PANEL_PORT}`;
export const settingsUrlDev = `http://localhost:${process.env.DEV_SETTINGS_PORT}`;
export const themeCreatorUrlDev = `http://localhost:${process.env.DEV_THEME_CREATOR_PORT}`;

export const panelUrlProd = `file://${resolve(__dirname, "../index.html")}`;
export const settingsUrlProd = `file://${resolve(__dirname, "../settings.html")}`;
export const themeCreatorUrlProd = `file://${resolve(__dirname, "../themeCreator.html")}`;

export const preloadMainScriptPathDev = `${resolve(process.cwd(), "dist/renderer", "loadMainContent.js")}`;
export const preloadMainScriptPathProd = `${resolve(__dirname, "../loadMainContent.js")}`;
export const preloadScriptPathDev = `${resolve(process.cwd(), "dist/renderer", "loadContent.js")}`;
export const preloadScriptPathProd = `${resolve(__dirname, "../loadContent.js")}`;

export const isFileBrowser = (url: string): boolean => {
  return !/file\/.+/.test(url);
};

export const isFigmaValidUrl = (url: string): boolean => {
  return /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com)/.test(url);
};
