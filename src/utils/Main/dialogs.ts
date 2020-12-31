import * as E from "electron";

export async function showMessageBox(view: E.BrowserWindow, options: E.MessageBoxOptions) {
  const result = await E.dialog.showMessageBox(view, options);
  return result.response;
}

export async function showOpenDialog(view: E.BrowserWindow, options: E.OpenDialogOptions) {
  const result = await E.dialog.showOpenDialog(view, options);
  return !result.canceled ? result.filePaths : null;
}

export async function showSaveDialog(view: E.BrowserWindow, options: E.SaveDialogOptions) {
  const result = await E.dialog.showSaveDialog(view, options);
  return !result.canceled && result.filePath ? result.filePath : null;
}
