// import * as E from "electron";
import * as React from "react";
import { observer, inject } from "mobx-react";

import './style.scss'

interface SettingsProps {
    tabs?: ITabsStore
}

@inject('tabs')
@observer
class Settings extends React.Component<SettingsProps, {}> {
    props: SettingsProps;

    constructor(props: SettingsProps) {
        super(props);

        this.props = props;
    }
    render() {
        return (
            <h1>Settings page</h1>
        );
    }
}

export default Settings;