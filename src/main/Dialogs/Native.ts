import { MessageBoxOptions, OpenDialogOptions, dialog } from "electron";

export class NativeDialogs implements ProviderDialog {
  constructor() {}

  public showMessageBox = async (options: Dialogs.MessageBoxOptions) => {
    const ops: MessageBoxOptions = {
      type: options.type,
      title: options.title,
      message: options.message,
      detail: options.detail,
      defaultId: 0,
    };

    if (options.type === "question") {
      const buttons = ["Ok", "Cancel"];

      if (options.textCancelButton) {
        buttons[1] = options.textCancelButton;
      }
      if (options.textOkButton) {
        buttons[0] = options.textOkButton;
      }
      ops.buttons = buttons;
    } else {
      if (options.textOkButton) {
        const buttons = ["Ok"];

        buttons[0] = options.textOkButton;

        ops.buttons = buttons;
      }
    }

    const result = await dialog.showMessageBox(null, ops);
    return result.response;
  };
  public showMessageBoxSync = (options: Dialogs.MessageBoxOptions) => {
    const ops: MessageBoxOptions = {
      type: options.type,
      title: options.title,
      message: options.message,
      detail: options.detail,
      defaultId: 0,
    };

    if (options.type === "question") {
      const buttons = ["Ok", "Cancel"];

      if (options.textCancelButton) {
        buttons[1] = options.textCancelButton;
      }
      if (options.textOkButton) {
        buttons[0] = options.textOkButton;
      }
      ops.buttons = buttons;
    } else {
      if (options.textOkButton) {
        const buttons = ["Ok"];

        buttons[0] = options.textOkButton;

        ops.buttons = buttons;
      }
    }

    const result = dialog.showMessageBoxSync(null, ops);
    return result;
  };

  public showOpenDialog = async (options: Dialogs.OpenOptions) => {
    const result = await dialog.showOpenDialog(null, options);
    return !result.canceled ? result.filePaths : null;
  };
  public showOpenDialogSync = (options: Dialogs.OpenOptions) => {
    const result = dialog.showOpenDialogSync(null, options as OpenDialogOptions);
    return result || [];
  };

  public showSaveDialog = async (options: Dialogs.SaveOptions) => {
    const result = await dialog.showSaveDialog(null, options);
    return !result.canceled && result.filePath ? result.filePath : null;
  };
  public showSaveDialogSync = (options: Dialogs.SaveOptions) => {
    const result = dialog.showSaveDialogSync(null, options);
    return result;
  };
}
