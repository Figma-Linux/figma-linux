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

    E.ipcRenderer.send("maintab");
    this.props.tabs.setFocus(1);
  };

  private onOpenSettings = (e: React.MouseEvent<HTMLDivElement> & Event): void => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();

    E.remote.app.emit("handle-command", "openSettings");
  };

  private onHomeClick = (): void => {
    E.ipcRenderer.send("toHome");
  };

  private newTab = (): void => {
    E.ipcRenderer.send("newtab");
  };

  render(): JSX.Element {
    return (
      <Panel
        scalePanel={this.props.settings.settings.ui.scalePanel}
        current={this.props.tabs.current}
        onMainTab={this.onMainTab}
        openSettings={this.onOpenSettings}
        onHomeClick={this.onHomeClick}
        newTab={this.newTab}
        getTab={this.props.tabs.getTab}
      />
    );
  }
}

export default TopPanel;
