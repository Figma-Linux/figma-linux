interface Tab {
  id: number;
  title?: string;
  url?: string;
  showBackBtn?: boolean;
  moves?: boolean;
  fileKey?: string;
  order?: number;
  focused?: boolean;
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

// TODO: don't uses?
interface SectionState {
  [state: string]: boolean;
  newFile: boolean;
  openFileBrowser: boolean;
  reopenClosedTab: boolean;
  closeTab: boolean;
  "save-as": boolean;
  "export-selected-exportables": boolean;
  undo: boolean;
  redo: boolean;
  "paste-over-selection": boolean;
  "toggle-dropper": boolean;
  "set-default-style": boolean;
  "copy-properties": boolean;
  "paste-properties": boolean;
  selectAll: boolean;
  "deselect-all": boolean;
  "select-inverse": boolean;
  "select-same-style": boolean;
  "select-same-fill": boolean;
  "select-same-stroke": boolean;
  "select-same-effect": boolean;
  "select-same-text": boolean;
  "select-same-font": boolean;
  "select-same-instance": boolean;
  "toggle-grid": boolean;
  "toggle-shown-layout-grids": boolean;
  "toggle-show-masks": boolean;
  "toggle-show-artboard-outlines": boolean;
  "toggle-rulers": boolean;
  "toggle-sidebar": boolean;
  "toggle-ui": boolean;
  "toggle-outlines": boolean;
  "toggle-layers": boolean;
  "toggle-publish": boolean;
  "toggle-library": boolean;
  "toggle-pixel-preview": boolean;
  "toggle-checkerboard": boolean;
  "zoom-in": boolean;
  "zoom-out": boolean;
  "zoom-reset": boolean;
  "zoom-to-fit": boolean;
  "zoom-to-selection": boolean;
  "scale-normal": boolean;
  "scale-inc0.1": boolean;
  "scale-dic0.1": boolean;
  "scale-inc0.05": boolean;
  "scale-dic0.05": boolean;
  "next-artboard": boolean;
  "previous-artboard": boolean;
  "group-selection": boolean;
  "ungroup-selection": boolean;
  "frame-selection": boolean;
  "mask-selection": boolean;
  "create-symbol": boolean;
  "find-symbol": boolean;
  "reset-symbol": boolean;
  "detach-instance": boolean;
  "resize-to-fit": boolean;
  "toggle-frame-clipping": boolean;
  "bring-to-front": boolean;
  "bring-forward": boolean;
  "send-backward": boolean;
  "send-to-back": boolean;
  "flip-horizontal": boolean;
  "flip-vertical": boolean;
  "rotate-180": boolean;
  "rotate-90-counterclockwise": boolean;
  "rotate-90-clockwise": boolean;
  "flatten-selection": boolean;
  "outline-stroke": boolean;
  "live-boolean-union": boolean;
  "live-boolean-subtract": boolean;
  "live-boolean-intersect": boolean;
  "live-boolean-xor": boolean;
  "duplicate-in-place": boolean;
  "delete-selection": boolean;
  "convert-to-raster": boolean;
  "toggle-shown-for-selected-nodes": boolean;
  "toggle-locked-for-selected-nodes": boolean;
  "hide-sibling-layers": boolean;
  "collapse-layers": boolean;
  "remove-fill": boolean;
  "remove-stroke": boolean;
  "swap-fill-and-stroke": boolean;
  "join-selection": boolean;
  "smooth-join-selection": boolean;
  "delete-and-heal-selection": boolean;
  "text-toggle-bold": boolean;
  "text-toggle-italic": boolean;
  "text-toggle-underline": boolean;
  "text-toggle-strikethrough": boolean;
  "text-original-case": boolean;
  "text-upper-case": boolean;
  "text-lower-case": boolean;
  "round-to-pixels": boolean;
  "align-left": boolean;
  "align-horizontal-center": boolean;
  "align-right": boolean;
  "align-top": boolean;
  "align-vertical-center": boolean;
  "align-bottom": boolean;
  "pack-horizontal": boolean;
  "pack-vertical": boolean;
  "distribute-horizontal-spacing": boolean;
  "distribute-vertical-spacing": boolean;
  "distribute-left": boolean;
  "distribute-horizontal-center": boolean;
  "distribute-right": boolean;
  "distribute-top": boolean;
  "distribute-vertical-center": boolean;
  "distribute-bottom": boolean;
}

interface FeatureFlags {
  desktop_beta_use_agent_for_fonts?: boolean;
}

interface SettingsInterface {
  clientId: string;
  app: {
    logLevel: number;
    enableColorSpaceSrgb: boolean;
    visibleNewProjectBtn: boolean;
    panelHeight: number;
    saveLastOpenedTabs: boolean;
    exportDir: string;
    fontDirs: string[];
    lastOpenedTabs: SavedTab[];
    featureFlags: FeatureFlags;
    savedExtensions: Extensions.ExtensionJson[];
    lastSavedPluginDir?: string;
    lastExportDir?: string;
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
