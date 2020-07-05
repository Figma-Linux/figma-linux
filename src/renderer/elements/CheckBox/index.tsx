import * as React from "react";

import "./index.scss";

export interface CheckBoxProps {
  onChange(checked: boolean): void;
  text?: string; // text for label
  value?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  className?: string; // custom style classes
}

export class CheckBox extends React.Component<CheckBoxProps, {}> {
  constructor(props: CheckBoxProps) {
    super(props);
  }

  render(): JSX.Element {
    const classNames: string[] = ["checkbox"];

    if (this.props.className) {
      classNames.push(this.props.className);
    }
    if (this.props.disabled) {
      classNames.push("disabled");
    }
    if (this.props.hidden) {
      classNames.push("hidden");
    }

    return (
      <div className={classNames.join(" ")}>
        <label>
          <input
            type="checkbox"
            name=""
            disabled={this.props.disabled ? true : false}
            checked={this.props.value ? true : false}
            onChange={e => this.props.onChange(!this.props.value)}
          />
          <span>{this.props.text || ""}</span>
        </label>
      </div>
    );
  }
}
