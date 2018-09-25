/// <reference path="../../../../@types/common/index.d.ts" />
/// <reference path="../../../../@types/renderer/stores/index.d.ts" />

import * as E from "electron";
import { Component } from "react";
import { h } from 'preact';
const { observer, connect } = require('mobx-preact');
import { toJS } from "mobx";

import * as Const from "Const";
import TabList from "./tabs";
import './style.scss'

interface TabsProps {
    tabs?: ITabsStore
}

@connect(['tabs'])
@observer
class Tabs extends Component<TabsProps, {}> {
    props: TabsProps;

    constructor(props: TabsProps) {
        super(props);

        this.props = props;
    }

    private close = (e: React.MouseEvent<HTMLDivElement> & Event, id: number) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        

        let tabs = toJS(this.props.tabs!.tabs);
        const currentTabId: number = toJS(this.props.tabs!.current);
        let index: number = tabs.findIndex(t => t.id == id);

        E.ipcRenderer.send('closetab', id);
        this.props.tabs!.deleteTab(id);

        if (id !== currentTabId) return;

        this.props.tabs!.setFocus(
            index != 0 ? 
                tabs[index > 0 ? index-1 : index].id
                :
                1
        );
    }

    private clickTab = (event: React.MouseEvent<HTMLDivElement> & Event, tab: Tab) => {
        console.log('clickTab, event: ', event);
        switch(event.button) {
            // Handle left click, set focuse on the target tab 
            case 0: {
                this.focus(event, tab.id);
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
        event.stopImmediatePropagation();

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