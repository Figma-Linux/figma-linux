/// <reference path="../../../../@types/common/index.d.ts" />
/// <reference path="../../../../@types/renderer/stores/index.d.ts" />

import * as E from "electron";
import * as React from "react";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import * as Const from "Const";
import TabList from "./tabs";
import './style.scss'

interface TabsProps {
    tabs?: ITabsStore
}

@inject('tabs')
@observer
class Tabs extends React.Component<TabsProps, {}> {
    props: TabsProps;

    constructor(props: TabsProps) {
        super(props);

        this.props = props;
    }

    private close = (e: React.MouseEvent<HTMLDivElement> & Event, id: number) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        let tabs = toJS(this.props.tabs!.tabs);
        const currentTabId: number = toJS(this.props.tabs!.current);
        let index: number = tabs.findIndex(t => t.id == id);

        E.ipcRenderer.send('closetab', id);
        this.props.tabs!.deleteTab(id);

        if (id !== currentTabId) return;

        this.props.tabs!.setFocus(
            index != 0 ? 
                tabs[index > 0 ? index-1 : index].id : 1
        );
    }

    private clickTab = (event: React.MouseEvent<HTMLDivElement> & Event, tab: Tab) => {
        switch(event.button) {
            // Handle left click, set focuse on the target tab 
            case 0: {
                const tabEl = event.target as HTMLDivElement;

                this.focus(event, tab.id);

                // Move tab
                if (/tab/.test(tabEl.className)) {
                    const currentTab: Tab = this.props.tabs.tabs.find(t => t.id === tab.id )
                    const TabContainer = tabEl.parentNode as HTMLDivElement;
                    const TabContainerRect = TabContainer.getBoundingClientRect();
                    const TabBox = tabEl.getBoundingClientRect();
                    const BoxXShift = event.pageX - TabBox.left;
                    let shift = 0;

                    this.props.tabs.updateTab({ ...currentTab, moves: true });

                    const onMouseMove = (e: MouseEvent) => {
                        const TabBoxUpdated = tabEl.getBoundingClientRect();
                        const left = Math.abs(e.pageX - (BoxXShift + TabBox.width));


                        tabEl.style.position = 'absolute';
                        tabEl.style.zIndex = '1000';
                        tabEl.style.height = '28px';

                        if ((e.pageX + (TabBox.width - BoxXShift)) > TabContainerRect.right) {
                            return;
                        }

                        if (TabBoxUpdated.left < TabContainerRect.left) {
                            shift += 3;

                            if (Math.floor((left / shift) < 0 ? 0 : (left / shift)) !== 0) {
                                tabEl.style.left = `-${left / shift}px`;
                            } else {
                                tabEl.style.left = `0px`;
                            }

                            return;
                        }

                        tabEl.style.left = `${left}px`;
                        shift = 0;
                    };
                    const onMouseUp = (e: MouseEvent) => {
                        tabEl.style.position = 'relative';
                        tabEl.style.left = `0px`;
                        tabEl.style.zIndex = '0';

                        this.props.tabs.updateTab({ ...currentTab, moves: false });

                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                    };

                    document.addEventListener('mousemove', onMouseMove)
                    document.addEventListener('mouseup', onMouseUp);
                }

            } break;
            // Handle middle click, close tab
            case 1: {
                this.close(event, tab.id);
            } break;
            // Handle right click, invoke the popup menu
            case 2: {
                this.popup(event, tab.id);
            } break;
        }
    }

    private focus = (event: React.MouseEvent<HTMLDivElement> & Event, id: number) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        E.ipcRenderer.send('focustab', id);
        this.props.tabs!.setFocus(id);
    }

    private popup = (event: React.MouseEvent<HTMLDivElement> & Event, id: number) => {
        const context: E.MenuItemConstructorOptions[] = [
            {
                id: 'copyAppUrl',
                label: 'Copy App Url',
                click: () => {
                    const tab: Tab | undefined = this.props.tabs.getTab(id);

                    tab && E.clipboard.writeText(encodeURI(`figma://file/${tab.fileKey}/${tab.title}`));
                }
            },
            {
                id: 'copyUrl',
                label: 'Copy Url',
                click: () => {
                    const tab: Tab | undefined = this.props.tabs.getTab(id);

                    tab && E.clipboard.writeText(`${Const.HOMEPAGE}/file/${tab.fileKey}`);
                }
            },
            { type: 'separator' },
            {
                id: 'openInBrowser',
                label: 'Open in Browser',
                click: () => {
                    const tab: Tab | undefined = this.props.tabs.getTab(id);

                    tab && E.remote.shell.openExternal(`${Const.HOMEPAGE}/file/${tab.fileKey}`);
                }
            },
            { type: 'separator' },
            {
                id: 'close',
                label: 'Close',
                visible: true,
                click: () => {
                    this.close(event, id);
                }
            }
        ];

        const menu = E.remote.Menu.buildFromTemplate(context);

        menu.popup({
            window: E.remote.getCurrentWindow()
        });
    }

    render() {
        return (
            <TabList
                tabs={toJS(this.props.tabs) as ITabsStore}
                close={this.close}
                clickTab={this.clickTab}
            />
        )
    }
}

export default Tabs;