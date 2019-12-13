import * as React from "react";

import Body from "./Body";
import TopPanel from "./TopPanel";
import "./style.scss";

class App extends React.Component<{}, {}> {
  props: {};

  constructor(props: {}) {
    super(props);

    this.props = props;
  }

  render() {
    return [<TopPanel key="1" />, <Body key="2" />];
  }
}

export default App;
