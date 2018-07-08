import * as E from "electron";
import { h, Component } from "preact";
import { observer, connect } from "mobx-preact";

import Panel from "./toppanel";
import './style.scss'

interface TopPanelProps {
    tabs?: ITabsStore
}

@connect(['tabs'])
@observer
class TopPanel extends Component<TopPanelProps, {}> {
    props: TopPanelProps;

    constructor(props) {
        super(props);

        this.props = props;
    }

    onMainTab = (e: Event) => {
        e.stopImmediatePropagation();
        e.stopPropagation();

        E.ipcRenderer.send('maintab');
        this.props.tabs.setFocus(1);
    }

    render() {
        return (
            <Panel
                onMainTab={this.onMainTab}
                current={this.props.tabs.current}
            />
        );
    }
}

export default TopPanel;