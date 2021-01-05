import * as React from "react";
import { observer, inject } from "mobx-react";

import { getColorPallet } from "Utils/Render";
import { Views } from "Store/Views";
import { Themes } from "Store/Themes";
import TopPanel from "./TopPanel";
import Settings from "./Settings";
import "./style.scss";

interface AppProps {
  views?: Views;
  themes?: Themes;
}

const viewMap = {
  TopPanel,
  Settings,
};

@inject("views")
@inject("themes")
@observer
class App extends React.Component<AppProps, unknown> {
  props: AppProps;

  constructor(props: AppProps) {
    super(props);

    this.props = props;
  }

  render(): JSX.Element {
    const theme = this.props.themes.getThemeById(this.props.themes.currentTheme);
    const pallet = getColorPallet(theme);

    const View = viewMap[this.props.views.view];
    return (
      <div id="body" style={pallet}>
        <View />
      </div>
    );
  }
}

export default App;
