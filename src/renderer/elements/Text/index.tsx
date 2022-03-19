import * as React from "react";

import "./index.css";

export interface TextProps {
  className?: string;
  type?: "title" | "subtitle";
  color?: "light" | "dark" | "inactive";
  children: string;
}

export class Text extends React.Component<TextProps, unknown> {
  constructor(props: TextProps) {
    super(props);
  }

  render(): JSX.Element {
    const classNames: string[] = ["text"];

    if (this.props.type) {
      classNames.push(`text_${this.props.type}`);
    }
    if (this.props.color) {
      classNames.push(`text_${this.props.color}`);
    }
    if (this.props.className) {
      classNames.push(this.props.className);
    }

    return <span className={classNames.join(" ")}>{this.props.children}</span>;
  }
}
