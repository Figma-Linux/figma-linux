import * as E from "electron";
import * as React from "react";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import "./style.scss";
import View from "./view";
import { Themes } from "Store/Themes";

interface CreatorProps {
  themes?: Themes;
}

@inject("themes")
@observer
class ThemeCreator extends React.Component<CreatorProps, unknown> {
  props: CreatorProps;

  constructor(props: CreatorProps) {
    super(props);

    this.props = props;
  }

  onChange = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>,
    key: string,
    color: string,
  ): void => {
    this.props.themes!.changeCreatorThemePalette(key, color);
  };

  onChangeThemeName = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.ChangeEvent<string>, value: string) => {
    this.props.themes.changeCreatorThemeName(value);
  };
  onChangeThemeAuthorName = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.ChangeEvent<string>,
    value: string,
  ) => {
    this.props.themes.changeCreatorThemeAuthorName(value);
  };

  onCloseClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();

    this.props.themes!.saveCreatorTheme();

    E.ipcRenderer.send("closeThemeCreatorView");
  };

  onExportClick = (): void => {
    E.ipcRenderer.send("themeCreatorExportTheme", toJS(this.props.themes!.creatorTheme));
  };

  onApplyThemeClick = (): void => {
    E.ipcRenderer.send("themes-change", toJS(this.props.themes!.creatorTheme));
  };

  render(): JSX.Element {
    return (
      <View
        onCloseClick={this.onCloseClick}
        onExportClick={this.onExportClick}
        onApplyThemeClick={this.onApplyThemeClick}
      />
    );
  }
}

export default ThemeCreator;
