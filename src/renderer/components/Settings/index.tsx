import * as E from "electron";
import * as React from "react";
import { observer, inject } from "mobx-react";

import "./style.scss";
import { Text } from "Elements";
import Header from "../Header";
import General from "./views/General";
import Shortcuts from "./views/Shortcuts";
import Themes from "./views/Themes";
import { Views } from "Store/Views";

interface SettingsProps {
  views?: Views;
}

@inject("views")
@observer
class Settings extends React.Component<SettingsProps, {}> {
  props: SettingsProps;
  viewMap = {
    General,
    Shortcuts,
    Themes,
  };

  constructor(props: SettingsProps) {
    super(props);

    this.props = props;
  }

  onCloseClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();

    E.remote.app.emit("handle-command", "closeSettings");
  };

  render(): JSX.Element {
    const View = this.viewMap[this.props.views.settingsView];
    const viewName = this.props.views.settingsView;

    return (
      <div className="settings">
        <Header text="Settings" displayCloseButton={true} onCloseClick={this.onCloseClick} />
        <div className="settings__panel">
          <div className="tab settings__tab" onClick={(): void => this.props.views.setSettingsView("General")}>
            <Text color={viewName === "General" ? "light" : "inactive"}>General</Text>
          </div>
          <div className="tab settings__tab" onClick={(): void => this.props.views.setSettingsView("Themes")}>
            <Text color={viewName === "Themes" ? "light" : "inactive"}>Themes</Text>
          </div>
        </div>
        <div className="settings__body">
          <View />
        </div>
      </div>
    );
  }
}

export default Settings;
