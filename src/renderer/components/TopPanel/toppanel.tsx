import * as React from "react";

import { Icon, Button } from "Elements";
import Tabs from "Components/Tabs";

interface TopPanelProps {
  current: number;
  scalePanel: number;

  newTab(): void;
  onMainTab(e: React.MouseEvent<HTMLDivElement>): void;
  openMenu(e: React.MouseEvent<HTMLDivElement>): void;
  closew(e: React.MouseEvent<HTMLDivElement>): void;
  maxiw(e: React.MouseEvent<HTMLDivElement>): void;
  miniw(e: React.MouseEvent<HTMLDivElement>): void;
}

const TopPanel: React.FunctionComponent<TopPanelProps> = props => {
  return (
    <div className="top-panel" style={{ zoom: props.scalePanel ? props.scalePanel : 1 }}>
      <div className="panelButtons">
        <Button className={`button_clear${!props.current ? " tab_active" : ""}`} onClick={props.onMainTab}>
          <Icon color="#7A7A7A" type="Main" size="18" />
        </Button>
        {/* // TODO: Add the new project button */}
      </div>
      <Tabs />
      <div className="panelButtons">
        <Button className="button_clear" onClick={props.openMenu}>
          <Icon color="#7A7A7A" type="MenuCorner" size="18" />
        </Button>
        <Button className="button_clear" onClick={props.miniw}>
          <Icon color="#7A7A7A" type="Minimize" size="18" />
        </Button>
        <Button className="button_clear" onClick={props.maxiw}>
          <Icon color="#7A7A7A" type="Maximize" size="18" />
        </Button>
        <Button className="button_clear" onClick={props.closew}>
          <Icon color="#7A7A7A" type="Close" size="18" />
        </Button>
      </div>
    </div>
  );
};

export default TopPanel;
