import * as E from "electron";
import * as Settings from "electron-settings";

import { app } from "Utils/Common";
import { shortcutsMap } from "./ShortcutsMap";
import shortcutMan from "Middleware/ShortcutMan";

export default () => {
  const currentWindow = E.remote.BrowserWindow.getAllWindows()[0];

  for (const shortcut of shortcutsMap) {
    if (shortcut.accelerator === "") continue;

    switch (shortcut.type) {
      case "command":
        {
          shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
            if (!Settings.get("app.disabledMainMenu")) return;

            console.log("command: ", !Settings.get("app.disabledMainMenu"), shortcut);

            // TODO: Replce on Event Emitter. Send the event to Main process
            // MenuHelper.handleCommandItemClick({ command: shortcut.value, accelerator: shortcut.accelerator }, currentWindow);
            app.emit(
              "handle-page-command",
              { command: shortcut.value, accelerator: shortcut.accelerator },
              currentWindow,
            );
          });
        }
        break;
      case "id":
        {
          shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
            if (!Settings.get("app.disabledMainMenu")) return;

            console.log("id: ", !Settings.get("app.disabledMainMenu"), shortcut);

            app.emit("handle-command", shortcut.value);
          });
        }
        break;

      default: {
      }
    }
  }
};
