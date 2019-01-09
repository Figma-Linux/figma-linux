import * as React from "react";

import Body from "./Body";
import TopPanel from "./TopPanel";
import './style.scss'

interface AppProps { }

class App extends React.Component<AppProps, {}> {
    props: AppProps;

    constructor(props: AppProps) {
        super(props);

        this.props = props;
    }

    render() {
        return [
            <TopPanel key='1' />,
            <Body key='2' />
        ];
    }
}

export default App;