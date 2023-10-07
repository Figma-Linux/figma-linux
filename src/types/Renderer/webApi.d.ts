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

  interface CreateFile {
    url: string;
    newFileInfo: {
      folder_id: number | null;
      org_id: number | null;
      openNewFileIn: "new_tab"; // enum value?
      trackingInfo: {
        from: "desktop_new_tab_button"; // enum value?
        selectedView: {
          view: "desktopNewTab"; // enum value?
        };
      };
      editorType: "design"; // enum value?
      localFileKey: string;
    };
    editorType: "design"; // enum value?
    isFromNewTabPage: boolean;
  }

  interface OpenCommunity {
    path: string;
    userId: string;
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
  interface NavigationConfigRule {
    test: string;
    urlType: string;
    normalizedPath?: any;
    title?: any;
    isNewFile?: boolean;
  }
  interface NavigationConfig {
    rules: NavigationConfigRule[];
  }
  interface SetInitOptions {
    userId: string;
    orgId: string | null;
    navigationConfig: NavigationConfig;
  }
}
