import { h, Component } from "preact";

import Panel from "./toppanel";
import './style.scss'

interface TopPanelProps { }

class TopPanel extends Component<TopPanelProps, {}> {
    props: TopPanelProps;

    constructor(props) {
        super(props);

        this.props = props;
    }

    render() {
        return (
            <Panel/>
        );
    }
}

export default TopPanel;