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

  interface ExtensionId {
    id: number;
  }

  interface CreateMultipleExtension {
    depth: number;
    options: Electron.OpenDialogOptions;
  }

  interface WriteFiles {
    files: [
      {
        name: string;
        buffer: Uint8Array;
      },
    ];
  }

  interface SetClipboardData {
    format: string;
    data: Uint8Array;
  }

  interface GetFonts {
    useAgent: boolean;
  }

  interface GetFontFile {
    path: string;
    postscript: string;
  }

  interface SetUsingMic {
    isUsingMicrophone: boolean;
  }
  interface SetIsInVoiceCall {
    isInVoiceCall: boolean;
  }
  interface SetUser {
    id: string;
  }
  interface SetAuthedUsers {
    userIDs: string[];
  }
  interface SetWorkspaceName {
    name: string;
  }
  interface SetFigjamEnabled {
    figjamEnabled: boolean;
  }
}
