declare namespace Extensions {
  type _FSWatcher = import("chokidar").FSWatcher;

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
}
