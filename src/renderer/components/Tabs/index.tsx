/// <reference path="../../../../@types/renderer/stores/index.d.ts" />
import { h, Component } from "preact";
import { observer, connect } from "mobx-preact";

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

    render(props: TabsProps) {
        return (
            <TabList
                tabs={this.props.tabs}
            />
        )

    }
}

export default Tabs;