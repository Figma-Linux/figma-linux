import { shortcutsMap } from "./ShortcutsMap";
import shortcutMan from "Middleware/ShortcutMan";

// TODO: fix shortcuts
export default () => {
  // const currentWindow = E.remote.BrowserWindow.getAllWindows()[0];

  for (const shortcut of shortcutsMap) {
    if (shortcut.accelerator === "") continue;

    switch (shortcut.type) {
      case "command":
        {
          shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
            // if (!Settings.getSync("app.disabledMainMenu")) return;
            // console.log("command: ", !Settings.getSync("app.disabledMainMenu"), shortcut);
            // TODO: Replce on Event Emitter. Send the event to Main process
            // MenuHelper.handleCommandItemClick({ command: shortcut.value, accelerator: shortcut.accelerator }, currentWindow);
            // app.emit(
            //   "handle-page-command",
            //   { command: shortcut.value, accelerator: shortcut.accelerator },
            //   currentWindow,
            // );
          });
        }
        break;
      case "id":
        {
          shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
            // if (!Settings.getSync("app.disabledMainMenu")) return;
            // console.log("id: ", !Settings.getSync("app.disabledMainMenu"), shortcut);
            // app.emit("handle-command", shortcut.value);
          });
        }
        break;

      default: {
      }
    }
  }
};
