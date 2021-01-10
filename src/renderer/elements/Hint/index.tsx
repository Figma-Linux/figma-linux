import * as React from "react";

import "./index.scss";

export interface HintProps {
  className?: string;
  hint: JSX.Element;
}

export class Hint extends React.Component<HintProps, unknown> {
  constructor(props: HintProps) {
    super(props);
  }

  render(): JSX.Element {
    const classNames: string[] = ["hint"];

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    return <div className={classNames.join(" ")}>{this.props.children}</div>;
  }
}
