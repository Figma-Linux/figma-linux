import * as React from "react";

import { Text } from "..";
import "./index.scss";

export interface ButtonProps {
  onClick?(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
  type?: "primary" | "secondary";
  className?: string;
  text?: string;
  contentBefore?: JSX.Element;
  contentAfter?: JSX.Element;
  disabled?: boolean;
}

export class Button extends React.Component<ButtonProps, unknown> {
  constructor(props: ButtonProps) {
    super(props);
  }

  render(): JSX.Element {
    let type = this.props.type;
    if (!type) {
      type = "primary";
    }

    const classNames: string[] = ["button", `button_${type}`];
    const onClick = this.props.onClick || ((): void => {});

    if (this.props.className) {
      classNames.push(this.props.className);
    }
    if (this.props.disabled) {
      classNames.push("button_disabled");
    }

    return (
      <div className={classNames.join(" ")} onClick={this.props.disabled ? null : onClick}>
        {this.props.contentBefore ? <div className="button__content_before">{this.props.contentBefore}</div> : ""}
        {this.props.text ? <Text>{this.props.text}</Text> : ""}
        {this.props.children ? this.props.children : ""}
        {this.props.contentAfter ? <div className="button__content_after">{this.props.contentAfter}</div> : ""}
      </div>
    );
  }
}
