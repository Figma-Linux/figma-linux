import * as React from "react";

import { Text, Button, Icon } from "Elements";

import "./style.scss";

interface HeaderProps {
  text: string;
  textAlign?: "left" | "right" | "center";
  displayCloseButton?: boolean;
  className?: string;
  additionalContent?: React.ReactElement;
  onCloseClick?(e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void;
}

const Header: React.FunctionComponent<HeaderProps> = props => {
  return (
    <div className={`header ${props.className ? props.className : ""}`}>
      <Text className="header__text">{props.text}</Text>
      <div className="header__additional">{props.additionalContent || null}</div>
      {props.displayCloseButton ? (
        <Button className="button_clear" onClick={props.onCloseClick}>
          <Icon color="var(--fg-header-control)" type="Close" size="18" />
        </Button>
      ) : (
        ""
      )}
    </div>
  );
};

export default Header;
