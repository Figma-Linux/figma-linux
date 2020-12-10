import * as E from "electron";
import * as React from "react";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import * as Const from "Const";
import { isComponentUrl, isValidProjectLink } from "Utils/Common";
import TabList from "./tabs";
import "./style.scss";

interface TabsProps {
  tabs?: TabsStore;
}

@inject("tabs")
@observer
class Tabs extends React.Component<TabsProps, {}> {
  props: TabsProps;

  constructor(props: TabsProps) {
    super(props);

    this.props = props;
  }

  private close = (e: React.MouseEvent<HTMLDivElement> & Event, id: number): void => {
    e.stopPropagation();

    const tabs = toJS(this.props.tabs.tabs);
    const tab = this.props.tabs.getTab(id);
    const currentTabId: number = toJS(this.props.tabs.current);
    const index: number = tabs.findIndex(t => t.id === id);

    if (isComponentUrl(tab.url)) {
      E.ipcRenderer.send("setFocusToMainTab");
    } else {
      E.ipcRenderer.send("closeTab", id);
    }

    this.props.tabs.deleteTab(id);

    if (id !== currentTabId) return;

    if (isComponentUrl(tab.url)) {
      this.props.tabs.setFocus(1);
    } else {
      this.props.tabs.setFocus(index !== 0 ? tabs[index > 0 ? index - 1 : index].id : 1);
    }
  };

  private clickTab = (e: React.MouseEvent<HTMLDivElement> & Event, tab: Tab): void => {
    e.stopPropagation();

    switch (e.button) {
      // Handle left click, set focus on the target tab
      case 0:
        {
          // const tabEl = e.target as any;

          this.focus(e, tab.id);

          // Move tab
          // if (/tab/.test(tabEl.className)) {
          //     const currentTab: Tab = this.props.tabs.tabs.find(t => t.id === tab.id )
          //     const TabContainer = tabEl.parentNode as any;
          //     const TabContainerRect = TabContainer.getBoundingClientRect();
          //     const TabBox = tabEl.getBoundingClientRect();
          //     const BoxXShift = event.pageX - TabBox.left;
          //     let fakeTab: any;
          //     let fakeTabBox: ClientRect | DOMRect;
          //     let fakeTabClassName: string;
          //     let shift = 1;
          //     let isMove = false;

          //     const onMouseMove = (e: MouseEvent) => {
          //         const TabBoxUpdated = tabEl.getBoundingClientRect();
          //         const left = Math.abs(e.pageX - (BoxXShift + TabBox.width));

          //         tabEl.style.position = 'absolute';
          //         tabEl.style.zIndex = '1000';
          //         tabEl.style.height = '28px';

          //         if (!isMove) {
          //             this.props.tabs.updateTab({ ...currentTab, moves: true });
          //             fakeTab = document.getElementsByClassName('fakeTab')[0] as any;
          //             fakeTabBox = fakeTab.getBoundingClientRect();
          //             fakeTabClassName = fakeTab.className;
          //             isMove = true;
          //         }

          //         // left side restriction
          //         if ((e.pageX + (TabBox.left - BoxXShift)) > TabContainerRect.right) {
          //             return;
          //         }

          //         // right side restriction
          //         if ((e.pageX - BoxXShift) < TabContainerRect.left) {
          //             shift += 3;

          //             if (Math.floor((left / shift) < 0 ? 0 : (left / shift)) !== 0) {
          //                 tabEl.style.left = `-${left / shift}px`;
          //             } else {
          //                 tabEl.style.left = `0px`;
          //             }

          //             return;
          //         }

          //         if (TabBoxUpdated.left > fakeTabBox.right - 30) {
          //             console.log('Move tab to right ', TabBoxUpdated.left, fakeTabBox.right - 30);
          //             // fakeTab.className = fakeTabClassName.replace(/order(\d)/, match => {
          //             //     let order = parseInt(match.replace(/\D/g, ''));
          //             //     return 'order' + (order + 2);
          //             // });
          //             this.props.tabs.updateTab({ ...currentTab, order: currentTab.order + 2 });
          //         }

          //         if (TabBoxUpdated.right < fakeTabBox.left + 30) {
          //             console.log('Move tab to left ', TabBoxUpdated.right, fakeTabBox.left + 30);
          //             // fakeTab.className = fakeTabClassName.replace(/order(\d)/, match => {
          //             //     let order = parseInt(match.replace(/\D/g, ''));
          //             //     return 'order' + (order - 2);
          //             // });
          //             this.props.tabs.updateTab({ ...currentTab, order: currentTab.order - 2 });
          //         }

          //         tabEl.style.left = `${left}px`;
          //         shift = 0;
          //     };
          //     const onMouseUp = (e: MouseEvent) => {
          //         tabEl.style.position = 'relative';
          //         tabEl.style.left = `0px`;
          //         tabEl.style.zIndex = '0';

          //         this.props.tabs.updateTab({ id: currentTab.id, moves: false });

          //         document.removeEventListener('mousemove', onMouseMove);
          //         document.removeEventListener('mouseup', onMouseUp);
          //     };

          //     document.addEventListener('mousemove', onMouseMove)
          //     document.addEventListener('mouseup', onMouseUp);
          // }
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
    const tab = this.props.tabs.getTab(id);

    if (isComponentUrl(tab.url)) {
      E.ipcRenderer.send("clearView");
    } else {
      E.ipcRenderer.send("setTabFocus", id);
    }

    this.props.tabs.setFocus(id);
  };

  private popup = (event: React.MouseEvent<HTMLDivElement> & Event, id: number): void => {
    const context: E.MenuItemConstructorOptions[] = [
      {
        id: "copyAppUrl",
        label: "Copy App Url",
        click: (): void => {
          const tab: Tab | undefined = this.props.tabs.getTab(id);

          console.log("Copy App url, tab.url: ", tab.url);

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

          console.log("Copy url, tab.url: ", tab.url);

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
          console.log("close tab id: ", id);
          this.close(event, id);
        },
      },
    ];

    const menu = E.remote.Menu.buildFromTemplate(context);

    menu.popup({
      window: E.remote.getCurrentWindow(),
    });
  };

  render(): JSX.Element {
    return <TabList tabs={toJS(this.props.tabs) as TabsStore} close={this.close} clickTab={this.clickTab} />;
  }
}

export default Tabs;
