import { ipcMain } from "electron";

import { storage } from "../Storage";
import { NativeDialogs } from "./Native";
import { ZenityDialogs } from "./Zenity";

export class Provider {
  private provider: ProviderDialog;

  constructor() {
    let provider: Dialogs.Providers = "Native";

    if (storage.get().app.useZenity) {
      provider = "Zenity";
    }

    this.provider = this.makeProvider(provider);

    this.initListeners();
  }

  private initListeners = () => {
    ipcMain.on("set-use-zenity", (_, value) => {
      if (value) {
        this.provider = this.makeProvider("Zenity");
      } else {
        this.provider = this.makeProvider("Native");
      }
    });
  };

  private makeProvider = (provider: Dialogs.Providers): ProviderDialog => {
    switch (provider) {
      case "Native": {
        return new NativeDialogs();
      }
      case "Zenity": {
        return new ZenityDialogs();
      }
      default: {
        return new NativeDialogs();
      }
    }
  };

  public showMessageBox = (params: Dialogs.MessageBoxOptions): Promise<number> => {
    return this.provider.showMessageBox(params);
  };
  public showMessageBoxSync = (params: Dialogs.MessageBoxOptions): number => {
    return this.provider.showMessageBoxSync(params);
  };

  public showOpenDialog = (params?: Dialogs.OpenOptions): Promise<string[] | null> => {
    return this.provider.showOpenDialog(params);
  };
  public showOpenDialogSync = (params?: Dialogs.OpenOptions): string[] | null => {
    return this.provider.showOpenDialogSync(params);
  };

  public showSaveDialog = (params: Dialogs.SaveOptions): Promise<string | null> => {
    return this.provider.showSaveDialog(params);
  };
  public showSaveDialogSync = (params: Dialogs.SaveOptions): string | null => {
    return this.provider.showSaveDialogSync(params);
  };
}

export const dialogs = new Provider();
