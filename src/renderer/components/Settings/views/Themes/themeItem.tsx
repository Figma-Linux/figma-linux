import * as React from "react";

import { Button, Text, Icon } from "Elements";

import "./index.scss";

interface ThemeViewItemProps {
  theme: Themes.Theme;

  onClickDelete?(e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string): void;
  onClickApply(e: React.MouseEvent<HTMLDivElement, MouseEvent>, theme: Themes.Theme): void;
}

const ThemeItem: React.FunctionComponent<ThemeViewItemProps> = props => {
  const theme = props.theme;

  return (
    <div className="themeview_item">
      <div className="themeview_item_tumbl">
        <div className="themeview_item_tumbl_top"></div>
        <div className="themeview_item_tumbl_toolpanel">
          <div>
            <Icon type="Burger" color="black" />
            <Icon type="Hand" color="black" />
          </div>
          <div>
            <Icon type="Component" color="black" />
          </div>
          <div>
            <Button className="template_button"></Button>
          </div>
        </div>
        <div className="themeview_item_tumbl_body">
          <div className="themeview_item_tumbl_body_left">
            <div className="themeview_item_tumbl_body_left_text1"></div>
            <div className="themeview_item_tumbl_body_left_text2"></div>
          </div>
          <div className="themeview_item_tumbl_body_center"></div>
          <div className="themeview_item_tumbl_body_right"></div>
        </div>
        <div className="themeview_item_tumbl_panel">
          <div>
            <Text className="themeview_item_tumbl_panel_name">{theme.name}</Text>
            <Text className="themeview_item_tumbl_panel_author">{theme.author}</Text>
          </div>
          <div>{props.onClickDelete ? <Icon type="Delete" size="24" color="black" /> : ""}</div>
        </div>
      </div>
      <div className="themeview_item_control flex">
        <Button className="button_default border_gray button_rounded" onClick={e => props.onClickApply(e, theme)}>
          Apply
        </Button>
      </div>
    </div>
  );
};

export default ThemeItem;
