import * as React from "react";

import { Button, Text, Icon } from "Elements";
import { getColorPallet } from "Utils/Render";

import "./index.scss";

interface ThemeViewItemProps {
  currentTheme: string;
  theme: Themes.Theme;

  onClickApply(e: React.MouseEvent<HTMLDivElement, MouseEvent>, theme: Themes.Theme): void;
}

const ThemeItem: React.FunctionComponent<ThemeViewItemProps> = props => {
  const theme = props.theme;
  const pallet = getColorPallet(theme);

  return (
    <div className="themeview_item">
      <div className="themeview_item_tumbl" style={pallet}>
        <div className="themeview_item_tumbl_top"></div>
        <div className="themeview_item_tumbl_toolpanel">
          <div>
            <Icon type="Burger" color="var(--text)" />
            <Icon type="Hand" color="var(--text)" />
          </div>
          <div>
            <Icon type="Component" color="var(--textComponent)" />
          </div>
          <div>
            <Button className="template_button button_clear"></Button>
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
      </div>
      <div className="themeview_item_tumbl_panel">
        <div>
          <Text className="themeview_item_tumbl_panel_name">{theme.name}</Text>
          <Text className="themeview_item_tumbl_panel_author">{theme.author}</Text>
        </div>
        <Button
          text={props.currentTheme === theme.id ? "Applied" : "Apply"}
          type={props.currentTheme === theme.id ? "secondary" : "primary"}
          className="width_60px justify__content_center"
          onClick={(e): void => props.onClickApply(e, theme)}
        />
      </div>
    </div>
  );
};

export default ThemeItem;
