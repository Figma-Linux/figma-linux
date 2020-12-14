import * as E from "electron";
import * as React from "react";
import { observer, inject } from "mobx-react";

import Panel from "./toppanel";
import { Settings } from "Store/Settings";
import { Views } from "Store/Views";
import "./style.scss";

interface TopPanelProps {
  tabs?: TabsStore;
  settings?: Settings;
  views?: Views;
}

@inject("tabs")
@inject("settings")
@inject("views")
@observer
class TopPanel extends React.Component<TopPanelProps, {}> {
  props: TopPanelProps;

  constructor(props: TopPanelProps) {
    super(props);

    this.props = props;
  }

  private onMainTab = (e: React.MouseEvent<HTMLDivElement> & Event): void => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();

    E.ipcRenderer.send("setFocusToMainTab");
    this.props.tabs.setFocus();
  };

  private onOpenSettings = (e: React.MouseEvent<HTMLDivElement> & Event): void => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();

    E.ipcRenderer.send("openSettingsView");
  };

  private onHomeClick = (): void => {
    E.ipcRenderer.send("toHome");
  };
  private closew = (event: React.MouseEvent<HTMLDivElement> & Event) => {
    E.ipcRenderer.send("app-exit");
  };
  private maxiw = (event: React.MouseEvent<HTMLDivElement> & Event) => {
    E.ipcRenderer.send("window-maximize");
  };
  private miniw = (event: React.MouseEvent<HTMLDivElement> & Event) => {
    E.ipcRenderer.send("window-minimize");
  };

  private newTab = (): void => {
    E.ipcRenderer.send("newTab");
  };

  render(): JSX.Element {
    return (
      <Panel
        miniw={this.miniw}
        maxiw={this.maxiw}
        closew={this.closew}
        scalePanel={this.props.settings.settings.ui.scalePanel}
        current={this.props.tabs.current}
        onMainTab={this.onMainTab}
        openSettings={this.onOpenSettings}
        onHomeClick={this.onHomeClick}
        newTab={this.newTab}
      />
    );
  }
}

export default TopPanel;
