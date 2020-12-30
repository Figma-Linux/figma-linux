import * as React from "react";

import { Icon } from "Elements";

import "./index.scss";

export interface ListProps {
  onRemove?(index: number): void;
  className?: string;
  items?: string[];
}

export class List extends React.Component<ListProps, unknown> {
  constructor(props: ListProps) {
    super(props);
  }

  render(): JSX.Element {
    const classNames: string[] = ["list"];
    const items = this.props.items || [];

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    return (
      <div className={classNames.join(" ")}>
        {items.map((item, i) => (
          <div key={i} className="list__item">
            {this.props.onRemove ? (
              <div className="list__delete hover" onClick={() => this.props.onRemove(i)}>
                <Icon type="Close" />
              </div>
            ) : (
              ""
            )}
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  }
}
