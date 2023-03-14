import { ipcRenderer } from "electron";
import { themes } from "./ThemesApplier";

(async () => {
  document.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.invoke("themesIsDisabled").then((disabled) => {
      if (!disabled) {
        setTimeout(() => {
          themes.init();
          themes.registerEventsForPreview();
        }, 10);
      }
    });
  });
})();
