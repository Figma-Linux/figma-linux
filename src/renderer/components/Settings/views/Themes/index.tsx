import * as React from "react";
import { observer, inject } from "mobx-react";

import { DEFAULT_THEME } from "Const";
import { Input, List, Text, Icon } from "Elements";
import { InputTypes } from "Elements/Input";

import ThemeItem from "./themeItem";
import { Themes as ThemesStore } from "Store/Themes";
import { Settings } from "Store/Settings";
import "./index.scss";

interface ThemeViewProps {
  settings?: Settings;
  themes?: ThemesStore;
}

@inject("settings")
@inject("themes")
@observer
class ThemesBody extends React.Component<ThemeViewProps, unknown> {
  props: ThemeViewProps;

  constructor(props: ThemeViewProps) {
    super(props);

    this.props = props;
  }

  onClickApply = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, theme: Themes.Theme): void => {
    // TODO: rewrite events
    // app.emit("themes-change", theme);
    this.props.settings.changeTheme(theme.id);
  };
  onClickDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: string): void => {};
  onClickDefaultThemeApply = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    // TODO: rewrite events
    // app.emit("set-default-theme");
    this.props.settings.changeTheme("0");
  };

  render(): JSX.Element {
    return (
      <div className="themes">
        <Text className="text_nopadding pad_top_10px" color="dark" type="subtitle">
          Add themes
        </Text>
        <div className="section section_end grid grid_1x3_input">
          <Input
            readonlyInput
            value=""
            type={InputTypes.Text}
            className="input_grid3 justify__content_space_around border_gray"
            suffix="%"
            placeholder="Upload JSON from local storage"
            onChange={e => {}}
            contentBefore={<Icon size="22" type="Folder" />}
            contentAfter={<Icon size="22" type="ArrowRight" />}
          />
          <div></div>
          <Input
            readonlyInput
            value=""
            type={InputTypes.Text}
            className="input_grid3 justify__content_space_around border_gray"
            placeholder="Paste a link with JSON from Github"
            suffix="%"
            onChange={e => {}}
            contentBefore={<Icon size="22" type="Github" />}
            contentAfter={<Icon size="22" type="ArrowRight" />}
          />
        </div>
        <Text color="dark" type="subtitle">
          Uploaded themes
        </Text>
        <div className="themeview">
          <ThemeItem theme={DEFAULT_THEME} onClickApply={this.onClickDefaultThemeApply} onClickDelete={e => {}} />
          {this.props.themes.themes.map(theme => (
            <ThemeItem
              key={theme.id}
              theme={theme}
              onClickApply={this.onClickApply}
              onClickDelete={this.onClickDelete}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default ThemesBody;
