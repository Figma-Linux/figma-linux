import * as E from "electron";
import { observable, action, autorun, toJS } from "mobx";

import * as Const from "Const";
import { isComponentUrl } from "Utils/Common";

export class Tabs implements TabsStore {
  @observable tabs: Tab[] = [];
  @observable current = 1;

  constructor() {
    this.events();
  }

  @action
  addTab = (data: { id: number; url: string; showBackBtn: boolean; title?: string }): void => {
    this.tabs.push({
      id: data.id,
      title: data.title ? data.title : "Figma",
      url: data.url,
      moves: false,
      showBackBtn: data.showBackBtn,
      order: this.tabs.length === 0 ? 1 : this.tabs.length + 1,
    });
  };

  @action
  deleteTab = (id: number): void => {
    this.tabs = this.tabs.filter(t => t.id !== id);
  };

  @action
  setFocus = (id: number): void => {
    this.current = id;
  };

  @action
  updateTab = (tab: Tab): void => {
    this.tabs = this.tabs
      .map(t => (t.id === tab.id ? { ...t, ...tab } : t))
      .sort((a, b) => (a.order > b.order ? 1 : 0));
  };

  @action
  changeTagOrder = (tab: Tab): void => {
    let tabs: Tab[] = toJS(this.tabs);

    tabs = tabs.map(t => (t.id === tab.id ? { ...tab, order: tab.order } : t));
    tabs.sort((a, b) => (a.order > b.order ? 1 : 0));

    this.tabs = tabs;
  };

  getTab = (id: number): Tab | undefined => {
    return this.tabs.length !== 0 ? this.tabs.find(tab => tab.id === id) : undefined;
  };

  private generateUniqueId = (collection: number[]): number => {
    const getRand = (): number => Math.round(Math.random() * (5000 - 1000) + 1000);
    let id = getRand();

    if (collection.includes(id)) {
      id = this.generateUniqueId(collection);
    }

    return id;
  };

  private events = (): void => {
    E.ipcRenderer.on(Const.TABADDED, (sender: any, data: Tab) => {
      if (isComponentUrl(data.url)) {
        const collection: number[] = this.tabs.map(el => el.id);

        data.id = this.generateUniqueId(collection);

        this.addTab({
          id: data.id,
          url: data.url,
          title: data.title,
          showBackBtn: data.showBackBtn,
        });
      } else {
        this.addTab({
          id: data.id,
          url: data.url,
          title: data.title ? data.title : "Recent Files",
          showBackBtn: data.showBackBtn,
        });
      }

      this.setFocus(data.id);
    });

    E.ipcRenderer.on(Const.CLOSEALLTAB, () => {
      this.current = 1;
      this.tabs = [];
    });

    E.ipcRenderer.on(Const.SETTITLE, (sender: any, data: { id: number; title: string }) => {
      this.tabs = this.tabs.map(t => (t.id === data.id ? { ...t, title: data.title } : t));
    });
    E.ipcRenderer.on(Const.SETTABURL, (sender: any, data: { id: number; url: string }) => {
      this.tabs = this.tabs.map(t => (t.id === data.id ? { ...t, url: data.url } : t));
    });

    E.ipcRenderer.on(Const.UPDATEFILEKEY, (sender: any, data: { id: number; fileKey: string }) => {
      this.tabs = this.tabs.map(t => (t.id === data.id ? { ...t, fileKey: data.fileKey } : t));
    });

    E.ipcRenderer.on(Const.CLOSETAB, (sender: any, data: { id: number }) => {
      const index: number = this.tabs.findIndex(t => t.id === data.id);
      this.deleteTab(data.id);

      this.setFocus(index != 0 ? this.tabs[index > 0 ? index - 1 : index].id : 1);
    });
  };
}

export const tabs: Tabs = new Tabs();

autorun(() => {
  E.ipcRenderer.send(Const.RECIVETABS, toJS(tabs.tabs));
});
