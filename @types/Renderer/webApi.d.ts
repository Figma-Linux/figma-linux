declare namespace WebApi {
  interface SetPluginMenuDataProps {
    data: Menu.MenuItem[];
  }

  interface WriteNewExtensionToDiskArgs {
    dirName: string;
    files: [
      {
        content: string;
        name: string;
      },
    ];
  }

  interface SetTitleArgs {
    title: string;
  }

  interface CreateMultipleExtension {
    depth: number;
    options: Electron.OpenDialogOptions;
  }
}
