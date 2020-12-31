declare namespace WebAPI {
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
}
