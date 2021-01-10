import * as React from "react";
import { observer, inject } from "mobx-react";

import { Button, Input, Text, List } from "Elements";
import { getColorPallet } from "Utils/Render";
import { PALETTE_TEXT } from "Const";
import Header from "../Header";
import Previewer from "./previewer";
import { Themes } from "Store/Themes";
import { toJS } from "mobx";

interface TopPanelProps {
  themes?: Themes;

  onCloseClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void;
  onColorClick(e: React.MouseEvent<HTMLInputElement, MouseEvent>, key: string): void;
  onExportClick(): void;
  onApplyThemeClick(): void;
}

const ThemeCreator: React.FunctionComponent<TopPanelProps> = props => {
  const theme = toJS(props.themes!.creatorTheme);
  const paletteKeys = Object.keys(theme.palette);
  const palette = getColorPallet(theme);

  return (
    <div className="creator">
      <Header
        className="creator__header"
        text="Theme Creator"
        displayCloseButton={true}
        onCloseClick={props.onCloseClick}
      />
      <div className="creator__body">
        <div className="creator__body_left">
          <Text type="subtitle">Theme name</Text>
          <Text type="subtitle">Theme author name</Text>
          <Input
            type="text"
            className=""
            placeholder="Theme name"
            value={theme.name}
            onChange={(e): void => props.themes!.changeCreatorThemeName(e.target.value)}
          />
          <Input
            type="text"
            className=""
            placeholder="Theme author name"
            value={theme.author}
            onChange={(e): void => props.themes!.changeCreatorThemeAuthorName(e.target.value)}
          />
          <List className="creator_view list_grab" style={palette} grabToScroll>
            <Previewer zoom={props.themes!.previewerZoom} />
          </List>
        </div>
        <div className="creator__body_right">
          <Text type="subtitle">Color palette</Text>
          <List className="list_hidden_tracks creator_list">
            {paletteKeys.map((key, index) => (
              <Input
                key={index}
                className="creator_list_item"
                type="color"
                value={theme.palette[key]}
                label={PALETTE_TEXT[key]}
                onChange={e => {
                  props.themes!.changeCreatorThemePalette(key, e.target.value);
                }}
                onClick={e => props.onColorClick(e, key)}
              />
            ))}
          </List>
        </div>
        <div className="creator__body_zoom">
          <Input
            readonlyInput
            value={Math.round(props.themes!.previewerZoom * 100)}
            type="range"
            className="justify__content_center"
            displayValue
            suffix="%"
            min={50}
            max={150}
            step={1}
            onChange={(e, d) => props.themes!.changeCreatorThemeZoom(d)}
          />
        </div>
        <div className="flex creator__body_buttons">
          <Button
            text="Export"
            type="primary"
            className="flex width_60px justify__content_center marg_right_10px"
            onClick={(e): void => props.onExportClick()}
          />
          <Button
            text="Apply theme"
            type="primary"
            className="flex justify__content_center"
            onClick={(e): void => props.onApplyThemeClick()}
          />
        </div>
      </div>
    </div>
  );
};

export default inject("themes")(observer(ThemeCreator));
