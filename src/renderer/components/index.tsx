import * as React from "react";
import { observer, inject } from "mobx-react";

import { Views } from "Store/Views";
import TopPanel from "./TopPanel";
import Settings from "./Settings";
import "./style.scss";

interface AppProps {
  views?: Views;
}

const viewMap = {
  TopPanel,
  Settings,
};

@inject("views")
@observer
class App extends React.Component<AppProps, {}> {
  props: AppProps;

  constructor(props: AppProps) {
    super(props);

    this.props = props;
  }

  render(): JSX.Element {
    const View = viewMap[this.props.views.view];
    return (
      <div id="body">
        <View />
      </div>
    );
  }
}

export default App;
