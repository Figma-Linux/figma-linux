declare namespace Dialogs {
  type Providers = "Native" | "Zenity";
  type Type = "error" | "warning" | "info" | "question";
  type FileFilter = import("electron").FileFilter;
  type OpenDialogOptions = import("electron").OpenDialogOptions;

  interface CammonOptions {
    title?: string;
    defaultPath?: string;
  }

  interface SaveOptions extends CammonOptions {
    showsTagField?: boolean;
  }
  interface OpenOptions extends CammonOptions {
    buttonLabel?: string;
    properties?: OpenDialogOptions["properties"];
    filters?: FileFilter[];
  }

  type MessageBoxOptions = ErrorBoxOptions | QuestionBoxOptions | WarningBoxOptions;
  interface BaseBoxOptions {
    textOkButton?: string;
    title?: string;
    message: string;
    detail?: string;
  }
  interface ErrorBoxOptions extends BaseBoxOptions {
    type: "error";
  }
  interface WarningBoxOptions extends BaseBoxOptions {
    type: "warning";
  }
  interface QuestionBoxOptions extends BaseBoxOptions {
    type: "question";
    textCancelButton?: string;
    defaultFocusedButton: "Ok" | "Cancel";
  }
}

declare interface ProviderDialog {
  showMessageBox(params: Dialogs.MessageBoxOptions): Promise<number>;
  showMessageBoxSync(params: Dialogs.MessageBoxOptions): number;

  showOpenDialog(params: Dialogs.OpenOptions): Promise<string[] | null>;
  showOpenDialogSync(params: Dialogs.OpenOptions): string[] | null;

  showSaveDialog(params: Dialogs.SaveOptions): Promise<string | null>;
  showSaveDialogSync(params: Dialogs.SaveOptions): string | null;
}
