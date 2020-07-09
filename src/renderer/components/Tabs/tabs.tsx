import * as React from "react";

import { Text, Button, Icon } from "Elements";

interface Props {
  tabs: TabsStore;

  close(e: React.MouseEvent<any>, id: number): void;
  clickTab(e: React.MouseEvent<any>, tab: Tab): void;
}

const Tabs: React.SFC<Props> = props => {
  return (
    <div className="tabBar">
      {props.tabs.tabs.map((t: Tab, i) => (
        <div
          key={i}
          className={`tab ${props.tabs.current === t.id ? "tab_active" : ""}`}
          onClick={e => props.clickTab(e, t)}
        >
          <Text color="light" className="tab__text">
            {t.title}
          </Text>
          <Button className="tab__close button_clear" onClick={(e): void => props.close(e, t.id)}>
            <Icon color="#FFFFFF" type="Close" size="16" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
