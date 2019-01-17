import * as React from "react";
import { observer, inject } from "mobx-react";

import SettingsComponent from "./Settings";
import { isComponentUrl, getComponentTitle } from "Utils";
import { Settings } from 'Store/Settings';

interface BodyProps {
    tabs?: ITabsStore;
    settings?: Settings;
}

@inject('tabs')
@inject('settings')
@observer
class Body extends React.Component<BodyProps, {}> {
    props: BodyProps;
    private components: any;

    constructor(props: BodyProps) {
        super(props);

        this.props = props;
        this.components = {
            Settings: <SettingsComponent />
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
            <div
                id="body"
                style={{
                    height: `calc(100% - ${this.props.settings.settings.app.panelHeight + 1}px)`
                }}
            >
                {this.loadComponent()}
            </div>
        );
    }
}

export default Body;