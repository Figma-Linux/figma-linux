// import * as E from "electron";
import * as React from "react";
import { observer, inject } from "mobx-react";
import { RouterView, ViewMap } from 'mobx-state-router';

import './style.scss'
import PanelBody from "./panel";
import General from "./views/General";
import Shortcuts from "./views/Shortcuts";
import { Routes } from '../../../stores/Routes';

interface SettingsProps {
    route?: Routes;
}

const routeMap: ViewMap = {
	general: <General/>,
	shortcuts: <Shortcuts/>
}

@inject('route')
@observer
class Settings extends React.Component<SettingsProps, {}> {
    props: SettingsProps;

    constructor(props: SettingsProps) {
        super(props);

        this.props = props;
    }
    render() {
        return (
            <div id="settings">
                <PanelBody
                    route={this.props.route}
                    currentRoute={this.props.route.route.getCurrentRoute()}
                />
                <div className="body">
                    <RouterView
                        routerStore={this.props.route.route}
                        viewMap={routeMap}
                    />
                </div>
            </div>
        );
    }
}

export default Settings;