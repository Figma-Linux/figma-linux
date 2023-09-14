declare namespace Types {
  interface Tab {
    id: number;
    title?: string;
    url?: string;
    moves?: boolean;
    fileKey?: string;
    order?: number;
    focused?: boolean;
    isUsingMicrophone?: boolean;
    isInVoiceCall?: boolean;
    view: import("electron").BrowserView;
  }

  type TabFront = Pick<Tab, "id" | "title" | "order" | "isUsingMicrophone" | "isInVoiceCall">;

  interface AddTabProps {
    id: number;
    url: string;
    title?: string;
    focused?: boolean;
    order?: number;
  }

  interface TabData {
    micAccess: boolean;
    view: import("electron").BrowserView;
  }

  interface SavedTab {
    title?: string;
    url?: string;
  }

  interface ShortcutsMap {
    accelerator: string;
    value: string;
    type: "action" | "command" | "id";
  }

  type View = "TopPanel" | "Settings" | "ThemeCreator";
  type SettingsView = "General" | "Themes";

  interface FeatureFlags {
    desktop_beta_use_agent_for_fonts?: boolean;
  }

  interface SettingsInterface {
    clientId: string;
    userId: string;
    authedUserIDs: string[];
    app: {
      logLevel: number;
      enableColorSpaceSrgb: boolean;
      visibleNewProjectBtn: boolean;
      useZenity: boolean;
      disableThemes: boolean;
      panelHeight: number;
      saveLastOpenedTabs: boolean;
      exportDir: string;
      fontDirs: string[];
      lastOpenedTabs:
        | {
            [key: string]: SavedTab[];
          }
        | SavedTab[];
      featureFlags: FeatureFlags;
      savedExtensions: Extensions.ExtensionJson[];
      lastSavedPluginDir?: string;
      lastExportDir?: string;
      themeDropdownOpen: boolean;
      creatorsThemesDropdownOpen: boolean;
      useOldPreviewer: boolean;
      dontShowTutorialCreator: boolean;
    };
    ui: {
      scalePanel: number;
      scaleFigmaUI: number;
    };
    theme: {
      currentTheme: string;
    };
    [path: string]: any;
  }
}
