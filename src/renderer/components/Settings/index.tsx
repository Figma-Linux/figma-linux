import * as E from "electron";
import * as React from "react";
import { observer, inject } from "mobx-react";

import "./style.scss";
import { Text, Button, Icon } from "Elements";
import Header from "../Header";
import General from "./views/General";
import Themes from "./views/Themes";
import { Views } from "Store/Views";
import { Settings as SettingsStore } from "Store/Settings";

interface SettingsProps {
  settings?: SettingsStore;
  views?: Views;
}

@inject("settings")
@inject("views")
@observer
class Settings extends React.Component<SettingsProps, unknown> {
  props: SettingsProps;
  viewMap = {
    General,
    Themes,
  };

  constructor(props: SettingsProps) {
    super(props);

    this.props = props;
  }

  onCloseClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();

    this.props.settings!.setSettings();

    E.ipcRenderer.send("closeSettingsView");
  };

  onSyncThemes = () => {
    E.ipcRenderer.send("sync-themes");
  };

  render(): JSX.Element {
    const View = this.viewMap[this.props.views.settingsView];
    const viewName = this.props.views.settingsView;
    const isSyncDisabled = this.props.settings!.isSyncDisabled;

    return (
      <div className="settings">
        <Header
          className="settings__header"
          text="Settings"
          displayCloseButton={true}
          additionalContent={
            viewName === "Themes" ? (
              <Button className="button_clear" onClick={() => this.onSyncThemes()} disabled={isSyncDisabled}>
                <Icon color="var(--fg-header-control)" size="22" type="Sync" isSpinner={isSyncDisabled} />
              </Button>
            ) : null
          }
          onCloseClick={this.onCloseClick}
        />
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
