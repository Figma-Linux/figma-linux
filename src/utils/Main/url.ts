import { resolve } from "path";
import { format as formatUrl } from "url";

export const winUrlDev = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`;

export const winUrlProd = formatUrl({
  pathname: resolve(__dirname, "../index.html"),
  protocol: "file",
  slashes: true,
});

export const isFileBrowser = (url: string): boolean => {
  return !/file\/.+/.test(url);
};

export const isFigmaValidUrl = (url: string): boolean => {
  return /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com)/.test(url);
};
