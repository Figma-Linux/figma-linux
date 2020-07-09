import * as React from "react";

import { Close } from "./icons/Close";
import { Corner } from "./icons/Corner";
import { Folder } from "./icons/Folder";
import { Github } from "./icons/Github";
import { Pencil } from "./icons/Pencil";
import { Arrow } from "./icons/Arrow";
import { Main } from "./icons/Main";
import { Plus } from "./icons/Plus";
import { Maximize } from "./icons/Maximize";
import { Minimize } from "./icons/Minimize";
import { Settings } from "./icons/Settings";

import "./index.scss";

type Icons =
  | "Close"
  | "Corner"
  | "Folder"
  | "Github"
  | "Pencil"
  | "Arrow"
  | "Main"
  | "Plus"
  | "Maximize"
  | "Minimize"
  | "Settings";

export interface IconProps {
  color?: string;
  size?: string;
}

export interface ContainerProps extends IconProps {
  type: Icons;
  className?: string;
}

export class Icon extends React.Component<ContainerProps, {}> {
  private iconsMap = {
    Close,
    Corner,
    Folder,
    Github,
    Pencil,
    Arrow,
    Main,
    Plus,
    Maximize,
    Minimize,
    Settings,
  };

  constructor(props: ContainerProps) {
    super(props);
  }

  render(): JSX.Element {
    const classNames: string[] = ["icon"];
    const IconView = this.iconsMap[this.props.type];
    const size = this.props.size || "16";

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    return (
      <div className={classNames.join(" ")}>
        <IconView color={this.props.color} size={size} />
      </div>
    );
  }
}
