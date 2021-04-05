import * as React from "react";

import { Text, Button, Icon } from "Elements";

interface Props {
  tabs: TabsStore;

  close(e: React.MouseEvent<any>, id: number): void;
  clickTab(e: React.MouseEvent<any>, tab: Tab): void;
  mouseDownHandler(e: React.MouseEvent<any>): void;
}

const Tabs: React.FunctionComponent<Props> = props => {
  return (
    <div className="tabBar" onMouseDown={props.mouseDownHandler}>
      {props.tabs.tabs.map((t: Tab, i: number) => (
        <div
          key={i}
          className={`tab ${props.tabs.current === t.id ? "tab_active" : ""}`}
          onClick={e => props.clickTab(e, t)}
          onAuxClick={e => props.clickTab(e, t)}
        >
          <Text className="tab__text pointer_events_none">{t.title}</Text>
          <Button className="tab__close button_clear" onClick={(e): void => props.close(e, t.id)}>
            <Icon
              color={`${props.tabs.current === t.id ? "var(--fg-tab-active)" : "var(--fg-tab)"}`}
              type="CloseTab"
              size="14"
            />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
