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

  ipcRenderer.on("changeZoomFactor", (_, zoom) => {
    document.body.style.zoom = zoom;
  });

  function keydownHandler(event: KeyboardEvent) {
    if (event.code === "AltLeft") {
      ipcRenderer.send("toggleThemeCreatorPreviewMask");
    }
  }

  document.addEventListener("keydown", keydownHandler);
})();
