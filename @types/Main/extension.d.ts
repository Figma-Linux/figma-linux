declare namespace Extensions {
  type _FSWatcher = import("chokidar").FSWatcher;

  type ManifestObserver = (args: Extensions.NotifyObserverParams) => void;

  enum Observertype {
    ADDED = "added",
    CHANGED = "changed",
    REMOVED = "removed",
  }

  interface Extension {
    path: string;
    lastKnownName?: string;
    manifestPath?: string;
    watcher?: _FSWatcher;
  }
  interface ExtensionWithManifest extends Extension {
    manifest: string;
  }
  interface ExtensionWithError extends Extension {
    error: string;
  }

  interface ExtensionJson {
    id: number;
    path?: string;
    lastKnownName?: string;
    manifestPath?: string;
    watcher?: _FSWatcher;
  }

  interface NotifyObserverParams {
    id: number;
    type: string;
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
    build?: string;
  }

  interface ExtensionSource {
    source: string;
    html: string;
  }
  interface ExtensionSourceError {
    buildErrCode: boolean;
    stderr: string;
    path: string;
  }
}
