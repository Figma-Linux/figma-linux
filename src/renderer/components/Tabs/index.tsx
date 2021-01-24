import * as E from "electron";
import * as React from "react";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import * as Const from "Const";
import { isValidProjectLink } from "Utils/Common";
import TabList from "./tabs";
import "./style.scss";

interface TabsProps {
  tabs?: TabsStore;
}

@inject("tabs")
@observer
class Tabs extends React.Component<TabsProps, unknown> {
  props: TabsProps;
  private pos = { x: 0, y: 0 };
  private isMoving = false;

  constructor(props: TabsProps) {
    super(props);

    this.props = props;
  }

  private close = (e: React.MouseEvent<HTMLDivElement> & Event, id: number): void => {
    e.stopPropagation();

    const tabs = toJS(this.props.tabs.tabs);
    const currentTabId: number | undefined = toJS(this.props.tabs.current);
    const currentTabIndex: number = tabs.findIndex((t: any) => t.id === id);

    E.ipcRenderer.send("closeTab", id);

    this.props.tabs.deleteTab(id);

    if (!currentTabId || id !== currentTabId) return;

    const index = currentTabIndex > 0 ? currentTabIndex - 1 : currentTabIndex;
    const nextTab = this.props.tabs!.tabs[index];

    this.props.tabs.setFocus(nextTab ? nextTab.id : undefined);
  };

  private clickTab = (e: React.MouseEvent<HTMLDivElement> & Event, tab: Tab): void => {
    e.stopPropagation();

    switch (e.button) {
      // Handle left click, set focus on the target tab
      case 0:
        {
          this.focus(e, tab.id);
        }
        break;
      // Handle middle click, close tab
      case 1:
        {
          this.close(e, tab.id);
        }
        break;
      // Handle right click, invoke the popup menu
      case 2:
        {
          this.popup(e, tab.id);
        }
        break;
    }
  };

  private focus = (event: React.MouseEvent<HTMLDivElement> & Event, id: number): void => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    E.ipcRenderer.send("setTabFocus", id);

    this.props.tabs.setFocus(id);
  };

  private popup = (event: React.MouseEvent<HTMLDivElement> & Event, id: number): void => {
    const context: E.MenuItemConstructorOptions[] = [
      {
        id: "copyAppUrl",
        label: "Copy App Url",
        click: (): void => {
          const tab: Tab | undefined = this.props.tabs.getTab(id);

          let url = `figma://file/${tab.fileKey}/${tab.title}`;

          if (!isValidProjectLink(tab.url)) {
            url = tab.url;
          }

          tab && E.clipboard.writeText(encodeURI(url));
        },
      },
      {
        id: "copyUrl",
        label: "Copy Url",
        click: (): void => {
          const tab: Tab | undefined = this.props.tabs.getTab(id);

          let url = `${Const.HOMEPAGE}/file/${tab.fileKey}`;

          if (!isValidProjectLink(tab.url)) {
            url = tab.url;
          }

          tab && E.clipboard.writeText(url);
        },
      },
      { type: "separator" },
      {
        id: "openInBrowser",
        label: "Open in Browser",
        click: (): void => {
          const tab: Tab | undefined = this.props.tabs.getTab(id);

          tab && E.remote.shell.openExternal(`${Const.HOMEPAGE}/file/${tab.fileKey}`);
        },
      },
      { type: "separator" },
      {
        id: "close",
        label: "Close",
        visible: true,
        click: (): void => {
          this.close(event, id);
        },
      },
    ];

    const menu = E.remote.Menu.buildFromTemplate(context);

    menu.popup({
      window: E.remote.getCurrentWindow(),
    });
  };

  private mouseDownHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    (e.target as HTMLDivElement).style.cursor = "move";

    this.isMoving = true;
    this.pos.x = e.pageX;
    this.pos.y = e.pageY;

    window.addEventListener("mousemove", this.mouseMoveHandler);
    window.addEventListener("mouseup", this.mouseUpHandler);
  };
  private mouseUpHandler = (e: MouseEvent) => {
    (e.target as HTMLDivElement).style.cursor = "default";
    this.isMoving = false;

    window.removeEventListener("mousemove", this.mouseMoveHandler);
    window.removeEventListener("mouseup", this.mouseUpHandler);
  };
  private mouseMoveHandler = (e: MouseEvent) => {
    if (!this.isMoving) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const w = E.remote.getCurrentWindow();
    const windowBounds = w.getBounds();

    w.setBounds({
      ...windowBounds,
      x: e.screenX - this.pos.x,
      y: e.screenY - this.pos.y,
    });
  };

  render(): JSX.Element {
    return (
      <TabList
        tabs={toJS(this.props.tabs) as TabsStore}
        close={this.close}
        clickTab={this.clickTab}
        mouseDownHandler={this.mouseDownHandler}
      />
    );
  }
}

export default Tabs;
