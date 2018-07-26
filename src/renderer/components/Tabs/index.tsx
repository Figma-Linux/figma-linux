/// <reference path="../../../../@types/common/index.d.ts" />
/// <reference path="../../../../@types/renderer/stores/index.d.ts" />

import { ipcRenderer } from "electron";
import { Component } from "react";
import { h } from 'preact';
const { observer, connect } = require('mobx-preact');
import { toJS } from "mobx";

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

    private close = (e: MouseEvent & Event, id: number) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        

        let tabs = toJS(this.props.tabs!.tabs);
        const currentTabId: number = toJS(this.props.tabs!.current);
        let index: number = tabs.findIndex(t => t.id == id);

        ipcRenderer.send('closetab', id);
        this.props.tabs!.deleteTab(id);

        if (id !== currentTabId) return;

        this.props.tabs!.setFocus(
            index != 0 ? 
                tabs[index > 0 ? index-1 : index].id
                :
                1
        );
    }

    private newTab = () => {
        ipcRenderer.send('newtab');
    }

    private clickTab = (event: MouseEvent & Event, tab: Tab) => {
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
                // console.log('clickTab right click, ', event.button);
            } break;
        }
    }

    private focus = (e: MouseEvent & Event, id: number) => {
        e.stopPropagation();
        e.stopImmediatePropagation();

        ipcRenderer.send('focustab', id);
        this.props.tabs!.setFocus(id);
    }

    render() {
        return (
            <TabList
                tabs={toJS(this.props.tabs) as ITabsStore}
                close={this.close}
                newTab={this.newTab}
                clickTab={this.clickTab}
            />
        )
    }
}

export default Tabs;