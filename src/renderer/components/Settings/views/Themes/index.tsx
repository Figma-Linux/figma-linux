import * as React from "react";
import { app } from "electron";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import { DEFAULT_THEME } from "Const";

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
    this.props.themes.changeTheme(theme.id);
  };
  onClickDefaultThemeApply = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    this.props.themes.changeTheme("0");
  };

  render(): JSX.Element {
    const themes = toJS(this.props.themes.themes);
    const currentTheme = toJS(this.props.themes.currentTheme);

    return (
      <div className="themes">
        <div className="themeview">
          <ThemeItem theme={DEFAULT_THEME} currentTheme={currentTheme} onClickApply={this.onClickDefaultThemeApply} />
          {themes.map(theme => (
            <ThemeItem key={theme.id} currentTheme={currentTheme} theme={theme} onClickApply={this.onClickApply} />
          ))}
        </div>
      </div>
    );
  }
}

export default ThemesBody;
