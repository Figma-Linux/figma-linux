// import * as E from "electron";
import * as React from "react";
import { observer, inject } from "mobx-react";

import Settings from "./Settings";
import { isComponentUrl, getComponentTitle } from "Utils";

interface BodyProps {
    tabs?: ITabsStore
}

@inject('tabs')
@observer
class Body extends React.Component<BodyProps, {}> {
    props: BodyProps;
    private components;

    constructor(props: BodyProps) {
        super(props);

        this.props = props;
        this.components = {
            Settings: <Settings/>
        };
    }

    private loadComponent = () => {
        const tabs = this.props.tabs.tabs;
        const currentTabId = this.props.tabs.current;
        const currentTab = tabs.find(t => t.id === currentTabId);

        if (currentTab && isComponentUrl(currentTab.url)) {
            const name = getComponentTitle(currentTab.url);

            return this.components[name];
        }

        return '';
    }

    render() {
        return (
            <div id="body">
                {this.loadComponent()}
            </div>
        );
    }
}

export default Body;