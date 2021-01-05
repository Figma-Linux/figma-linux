import * as React from "react";

import { Icon, Button } from "Elements";
import Tabs from "Components/Tabs";

interface TopPanelProps {
  current: number;
  scalePanel: number;
  visibleNewProjectBtn: boolean;

  newTab(): void;
  onMainTab(e: React.MouseEvent<HTMLDivElement>): void;
  onNewProject(e: React.MouseEvent<HTMLDivElement>): void;
  openMenu(e: React.MouseEvent<HTMLDivElement>): void;
  closew(e: React.MouseEvent<HTMLDivElement>): void;
  maxiw(e: React.MouseEvent<HTMLDivElement>): void;
  miniw(e: React.MouseEvent<HTMLDivElement>): void;
}

const TopPanel: React.FunctionComponent<TopPanelProps> = props => {
  return (
    <div className="top-panel" style={{ zoom: props.scalePanel ? props.scalePanel : 1 }}>
      <div className="panelButtons">
        <Button className={`button_clear button_title${!props.current ? " tab_active" : ""}`} onClick={props.onMainTab}>
          <Icon color="var(--bg-header-control-text)" type="Main" size="18" />
        </Button>
        {props.visibleNewProjectBtn ? (
          <Button className="button_clear button_title" onClick={props.onNewProject}>
            <Icon color="var(--bg-header-control-text)" type="Plus" size="18" />
          </Button>
        ) : (
          ""
        )}
      </div>
      <Tabs />
      <div className="panelButtons">
        <Button className="button_clear button_title" onClick={props.openMenu}>
          <Icon color="var(--bg-header-control-text)" type="MenuCorner" size="18" />
        </Button>
        <Button className="button_clear button_control" onClick={props.miniw}>
          <Icon color="var(--bg-header-control-text)" type="Minimize" size="18" />
        </Button>
        <Button className="button_clear button_control" onClick={props.maxiw}>
          <Icon color="var(--bg-header-control-text)" type="Maximize" size="18" />
        </Button>
        <Button className="button_clear button_control button_close" onClick={props.closew}>
          <Icon color="var(--bg-header-control-text)" type="Close" size="18" />
        </Button>
      </div>
    </div>
  );
};

export default TopPanel;
