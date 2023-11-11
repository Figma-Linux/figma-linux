declare namespace Extensions {
  type _FSWatcher = import("chokidar").FSWatcher;

  type ManifestObserver = (args: Extensions.NotifyObserverParams) => void;

  type ObserverType = "changed" | "added" | "removed";

  interface Extension {
    path: string;
    lastKnownPluginId: string;
    lastKnownName: string;
    cachedContainsWidget: boolean;
    observeFiles: Map<string, _FSWatcher>;
  }
  interface ExtensionWithManifest extends Extension {
    manifest: string;
  }
  interface ExtensionWithError extends Extension {
    error: string;
  }

  interface ExtensionJson extends Omit<Extension, "observeFiles"> {
    id: number;
    files: string[];
  }

  interface NotifyObserverParams {
    id: number;
    type: string;
    manifestFileId?: number;
    localLoadResult?: Extension;
  }

  interface AddPathReturnValue {
    id: number;
    existed: boolean;
  }

  interface ManifestFile {
    name: string;
    id: string;
    api: string;
    main: string;
    capabilities: string[];
    enableProposedApi: boolean;
    editorType: string[];
    ui?: string | Dict<string>;
    networkAccess?: {
      allowedDomains: string[];
    };
    build?: string;
  }

  interface ExtensionSource {
    source?: string;
    html?: Dict<string> | string;
    buildErrCode?: number;
    stdout?: string;
    stderr?: string;
    path?: string;
  }
}
