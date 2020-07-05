import * as React from "react";

import "./index.scss";

export interface ComboBoxProps {
  className?: string;
  items?: string[];
}

export class ComboBox extends React.Component<ComboBoxProps, {}> {
  constructor(props: ComboBoxProps) {
    super(props);
  }

  render(): JSX.Element {
    const classNames: string[] = ["combobox"];
    const items = this.props.items || [];

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    return (
      <select className={classNames.join(" ")}>
        {items.map((item, index) => (
          <option key={index}>{item}</option>
        ))}
      </select>
    );
  }
}
