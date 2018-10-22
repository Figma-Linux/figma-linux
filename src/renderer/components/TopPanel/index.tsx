import * as E from "electron";
import * as React from "react";
import { observer, inject } from "mobx-react";

import Panel from "./toppanel";
import './style.scss'

interface TopPanelProps {
    tabs?: ITabsStore
}

@inject('tabs')
@observer
class TopPanel extends React.Component<TopPanelProps, {}> {
    props: TopPanelProps;

    constructor(props: TopPanelProps) {
        super(props);

        this.props = props;
    }

    private onMainTab = (e: React.MouseEvent<HTMLDivElement> & Event) => {
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();

        E.ipcRenderer.send('maintab');
        this.props.tabs!.setFocus(1);
    }

    private onHomeClick = (event: React.MouseEvent<HTMLDivElement> & Event) => {
        E.ipcRenderer.send('toHome');
    }

    private newTab = () => {
        E.ipcRenderer.send('newtab');
    }

    render() {
        return (
            <Panel
                current={this.props.tabs!.current}
                onMainTab={this.onMainTab}
                onHomeClick={this.onHomeClick}
                newTab={this.newTab}
                getTab={this.props.tabs!.getTab}
            />
        );
    }
}

export default TopPanel;