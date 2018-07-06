import { h, Component } from "preact";

import TopPanel from "./TopPanel";
import './style.scss'

interface AppProps { }

class App extends Component<AppProps, {}> {
    props: AppProps;

    constructor(props) {
        super(props);

        this.props = props;
    }

    render() {
        return (
            <TopPanel/>
        );
    }
}

export default App;