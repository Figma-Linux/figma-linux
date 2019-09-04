import * as Chokidar from 'chokidar';

import { loadExtensionManifest } from 'Utils/Main'

class ExtensionManager {
    private extensionMap: Map<number, any>;
    private manifestObservers: any[];

    constructor() {
        this.extensionMap = new Map();
        this.manifestObservers = [];
    }

    public addPath (path: string): {id: number; existed: boolean} {
        for (const [id, entry] of this.extensionMap.entries()) {
            if (entry.path === path) {
                return { id, existed: true };
            }
        }

        let id = 1;
        while (this.extensionMap.has(id)) {
            id++;
        }

        if (this.manifestObservers.length) {
            const watcher = Chokidar.watch(path, undefined);
            watcher.on('all', () => this.fileWatcher(id));
            this.extensionMap.set(id, { path, watcher });
            loadExtensionManifest(id).then(result => {
                this.notifyObservers({ type: 'added', id, localLoadResult: result });
            });
        } else {
            this.extensionMap.set(id, { path });
        }

        // storage_1.scheduleSaveSoon();

        return { id, existed: false };
    }
    public getPath(id: number): string {
        const entry = this.extensionMap.get(id);

        if (!entry) {
            throw new Error('Unknown plugin');
        }

        return entry.path;
    }
    public removePath(id: number): void {
        const entry = this.extensionMap.get(id);

        if (entry && entry.watcher) {
            try {
                entry.watcher.close();
            } catch (e) {}
        }

        this.extensionMap.delete(id);
        // storage_1.scheduleSaveSoon();
        this.notifyObservers({ id, type: 'removed' });
    }

    public getLastKnownName(id: number): string | undefined {
        const entry = this.extensionMap.get(id);

        if (entry) {
            return entry.lastKnownName;
        }

        return undefined;
    }

    public getOrUpdateKnownNameFromManifest(id: number, manifest: string): string | undefined {
        const entry = this.extensionMap.get(id);

        if (entry) {
            try {
                const parsed = JSON.parse(manifest);
                if (parsed && parsed.name) {
                    entry.lastKnownName = parsed.name;
                }
            } catch (e) {}

            return entry.lastKnownName;
        }

        return undefined;
    }

    public getAllIds(): number[] {
        return Array.from(this.extensionMap.keys());
    }

    public addObserver(callback: Function): void {
        this.manifestObservers.push(callback);

        if (this.manifestObservers.length === 1) {
            this.extensionMap.forEach((entry, id) => {
                if (!entry.watcher) {
                    entry.watcher = Chokidar.watch(entry.path, undefined);
                    entry.watcher.on('all', () => this.fileWatcher(id));
                }
            });
        }
    }
    public removeObserver(callback: Function): void {
        const index = this.manifestObservers.indexOf(callback);

        if (index !== -1) {
            this.manifestObservers.splice(index, 1);

            if (!this.manifestObservers.length) {
                this.extensionMap.forEach((entry) => {
                    if (entry.watcher) {
                        entry.watcher.close();
                        delete entry.watcher;
                    }
                });
            }
        }
    }

    public saveToJson() {
        return Array
            .from(this.extensionMap.entries())
            .map(([id, { path, lastKnownName }]) => {
                return { id, manifestPath: path, lastKnownName };
            });
    }
    public loadFromJson(json: Extensions.Extension[]): void {
        if (Array.isArray(json)) {
            for (const jsonExtension of json) {
                if (typeof jsonExtension.id === 'number' &&
                    Math.trunc(jsonExtension.id) == jsonExtension.id &&
                    typeof jsonExtension.manifestPath === 'string') {
                    this.extensionMap.set(jsonExtension.id, {
                        path: jsonExtension.manifestPath,
                        lastKnownName: jsonExtension.lastKnownName
                    });
                }
            }
        }
    }

    private notifyObservers(args: any): void {
        this.manifestObservers.forEach(callback => {
            try {
                callback(args);
            } catch (ex) {
                console.error(ex);
            }
        });
    }

    private fileWatcher(id: number): void {
        loadExtensionManifest(id).then(result => {
            this.notifyObservers({ type: 'changed', id, localLoadResult: result });
        });
    }
}

export default new ExtensionManager();
