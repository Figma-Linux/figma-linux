import * as React from "react";

import { Text } from "Elements";

import "./style.scss";

interface HeaderProps {
  text: string;
  textAlign?: "left" | "right" | "center";
  displayCloseButton?: boolean;
  onCloseClick?(e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void;
}

const Header: React.SFC<HeaderProps> = props => {
  return (
    <div className="header">
      <Text color="light" type="subtitle" className="header__text">
        {props.text}
      </Text>
      {props.displayCloseButton ? (
        <span className="header__close hover" onClick={props.onCloseClick}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4.00007 12M4 4L11.9999 12" stroke="#707070" />
          </svg>
        </span>
      ) : (
        ""
      )}
    </div>
  );
};

export default Header;
