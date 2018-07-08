/// <reference path="../../../../@types/renderer/stores/index.d.ts" />
import { ipcRenderer } from "electron";
import { h, Component } from "preact";
import { observer, connect } from "mobx-preact";
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

    constructor(props) {
        super(props);

        this.props = props;
    }

    close = (e: Event, id: number) => {
        e.stopPropagation();
        e.stopImmediatePropagation();

        let tabs = toJS(this.props.tabs.tabs);
        const currentTabId: number = toJS(this.props.tabs.current);
        let index: number = tabs.findIndex(t => t.id == id);

        ipcRenderer.send('closetab', id);
        this.props.tabs.deleteTab(id);

        if (id !== currentTabId) return;

        this.props.tabs.setFocus(
            index != 0 ? 
                tabs[index > 0 ? index-1 : index].id
                :
                1
        );
    }
    
    newTab = () => {
        ipcRenderer.send('newtab');
    }

    focus = (e: Event, id: number) => {
        e.stopPropagation();
        e.stopImmediatePropagation();

        ipcRenderer.send('focustab', id);
        this.props.tabs.setFocus(id);
    }

    render(props: TabsProps) {
        return (
            <TabList
                tabs={toJS(this.props.tabs)}
                close={this.close}
                newTab={this.newTab}
                focus={this.focus}
            />
        )

    }
}

export default Tabs;