declare namespace Dialogs {
  type Providers = "Native" | "Zenity";
  type Type = "error" | "warning" | "info" | "question";

  interface SaveOptions {
    title?: string;
    defaultPath?: string;
    showsTagField?: boolean;
  }
  interface OpenOptions {
    buttonLabel?: string;
    defaultPath?: string;
    properties?: string[];
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
