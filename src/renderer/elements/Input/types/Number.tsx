import * as React from "react";

import "../index.scss";

export interface InputNumberProps {
  onChange(event: React.MouseEvent<any> | React.ChangeEvent<any>, delta: number): void;
  value?: string | number;
  readonlyInput?: boolean;
  suffix?: string;
}

export const InputNumber: React.SFC<InputNumberProps> = props => {
  return (
    <React.Fragment>
      <div className="button minus" onClick={e => props.onChange(e, +props.value - 5)}>
        -
      </div>
      <div className="body">
        <input
          readOnly={!!props.readonlyInput}
          type="text"
          value={props.value ? props.value : ""}
          onChange={e => props.onChange(e, +e.target.value)}
        />
        <span className="suffix">{props.suffix || "%"}</span>
      </div>
      <div className="button plus" onClick={e => props.onChange(e, +props.value + 5)}>
        +
      </div>
    </React.Fragment>
  );
};
