import * as React from "react";

import { Text, Button, Icon } from "Elements";

import "./style.scss";

interface HeaderProps {
  text: string;
  textAlign?: "left" | "right" | "center";
  displayCloseButton?: boolean;
  className?: string;
  onCloseClick?(e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void;
}

const Header: React.FunctionComponent<HeaderProps> = props => {
  return (
    <div className={`header ${props.className ? props.className : ""}`}>
      <Text className="header__text">{props.text}</Text>
      {props.displayCloseButton ? (
        <Button className="button_clear" onClick={props.onCloseClick}>
          <Icon color="var(--bg-header-control-text)" type="Close" size="16" />
        </Button>
      ) : (
        ""
      )}
    </div>
  );
};

export default Header;
