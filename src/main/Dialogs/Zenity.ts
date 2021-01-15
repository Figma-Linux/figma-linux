import { process } from "../Process";

export class ZenityDialogs implements ProviderDialog {
  constructor() {}

  public showMessageBox = async (options: Dialogs.MessageBoxOptions) => {
    const cmd = [`zenity --${options.type} --ellipsize`];

    if (options.title) {
      cmd.push(`--title="${options.title}"`);
    }
    if (options.detail) {
      cmd.push(`--text="${options.message}\n${options.detail}"`);
    }
    if (options.textOkButton) {
      cmd.push(`--ok-label="${options.textOkButton}"`);
    }
    if (options.type === "question") {
      if (options.textCancelButton) {
        cmd.push(`--cancel-label="${options.textCancelButton}"`);
      }
      if (options.defaultFocusedButton === "Cancel") {
        cmd.push(`--default-cancel`);
      }
    }

    try {
      await process.exec(cmd.join(" "));
      return 0;
    } catch (error) {
      return 1;
    }
  };
  public showMessageBoxSync = (options: Dialogs.MessageBoxOptions) => {
    const cmd = [`zenity --${options.type} --ellipsize`];

    if (options.title) {
      cmd.push(`--title="${options.title}"`);
    }
    if (options.detail) {
      cmd.push(`--text="${options.message}\n${options.detail}"`);
    }
    if (options.textOkButton) {
      cmd.push(`--ok-label="${options.textOkButton}"`);
    }
    if (options.type === "question") {
      if (options.textCancelButton) {
        cmd.push(`--cancel-label="${options.textCancelButton}"`);
      }
      if (options.defaultFocusedButton === "Cancel") {
        cmd.push(`--default-cancel`);
      }
    }

    try {
      process.execSync(cmd.join(" "));
      return 0;
    } catch (error) {
      return 1;
    }
  };

  public showOpenDialog = async (options: Dialogs.OpenOptions) => {
    const cmd = ["zenity --file-selection"];

    if (options.defaultPath) {
      cmd.push(`--filename="${options.defaultPath}"`);
    }
    if (Array.isArray(options.properties) && options.properties.length > 0) {
      for (const prop of options.properties) {
        switch (prop) {
          case "openDirectory": {
            cmd.push(`--directory`);
            break;
          }
          case "multiSelections": {
            cmd.push(`--multiple`);
            break;
          }
        }
      }
    }

    let result: string[] | undefined;
    try {
      const stdout = await process.exec(cmd.join(" "));
      result = stdout.replace(/\n/, "").split("|");
    } catch (error) {
      return null;
    }

    return result;
  };
  public showOpenDialogSync = (options: Dialogs.OpenOptions) => {
    const cmd = ["zenity --file-selection"];

    if (options.defaultPath) {
      cmd.push(`--filename="${options.defaultPath}"`);
    }
    if (Array.isArray(options.properties) && options.properties.length > 0) {
      for (const prop of options.properties) {
        switch (prop) {
          case "openDirectory": {
            cmd.push(`--directory`);
            break;
          }
          case "multiSelections": {
            cmd.push(`--multiple`);
            break;
          }
        }
      }
    }

    let result: string[] | undefined;
    try {
      const stdout = process.execSync(cmd.join(" "));
      result = stdout.replace(/\n/, "").split("|");
    } catch (error) {
      return null;
    }

    return result;
  };

  public showSaveDialog = async (options: Dialogs.SaveOptions) => {
    const cmd = ["zenity --file-selection --save --confirm-overwrite"];

    if (options.defaultPath) {
      cmd.push(`--filename="${options.defaultPath}"`);
    }

    let result: string | undefined;
    try {
      result = await process.exec(cmd.join(" "));
      result = result.replace(/\n/, "");
    } catch (error) {
      return null;
    }

    return result;
  };
  public showSaveDialogSync = (options: Dialogs.SaveOptions) => {
    const cmd = ["zenity --file-selection --save --confirm-overwrite"];

    if (options.defaultPath) {
      cmd.push(`--filename="${options.defaultPath}"`);
    }

    let result: string | undefined;
    try {
      result = process.execSync(cmd.join(" "));
      result = result.replace(/\n/, "");
    } catch (error) {
      return null;
    }

    return result;
  };
}
