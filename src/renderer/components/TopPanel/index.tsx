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

interface TopPanelStates {
  isMaximized: boolean;
}

@inject("tabs")
@inject("settings")
@inject("views")
@observer
class TopPanel extends React.Component<TopPanelProps, unknown> {
  props: TopPanelProps;
  state: TopPanelStates;

  constructor(props: TopPanelProps) {
    super(props);

    this.props = props;
    this.state = { isMaximized: false };
  }

  componentDidMount(): void {
    E.ipcRenderer.on("did-maximized", () => {
      this.setState({ isMaximized: true });
    });

    E.ipcRenderer.on("did-restored", () => {
      this.setState({ isMaximized: false });
    });
  }

  private onMainTab = (e: React.MouseEvent<HTMLDivElement> & Event): void => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();

    E.ipcRenderer.send("setFocusToMainTab");
    this.props.tabs.setFocus();
  };

  private onNewProject = (e: React.MouseEvent<HTMLDivElement> & Event): void => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();

    E.ipcRenderer.send("newProject");
  };

  private onOpenMenu = (e: React.MouseEvent<HTMLDivElement> & Event): void => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();

    E.ipcRenderer.send("openMenu");
  };

  private closew = (event: React.MouseEvent<HTMLDivElement> & Event) => {
    E.ipcRenderer.send("appExit");
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
        visibleNewProjectBtn={this.props.settings.settings.app.visibleNewProjectBtn}
        current={this.props.tabs.current}
        onNewProject={this.onNewProject}
        onMainTab={this.onMainTab}
        openMenu={this.onOpenMenu}
        newTab={this.newTab}
        isMaximized={this.state.isMaximized}
      />
    );
  }
}

export default TopPanel;
