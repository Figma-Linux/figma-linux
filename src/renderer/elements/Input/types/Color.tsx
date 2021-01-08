import * as React from "react";

import "../index.scss";

export interface InputColorProps {
  onChange(event: React.MouseEvent<any> | React.ChangeEvent<any>, color: string): void;
  value?: string;
  label?: string;
  labelPos?: "left" | "right" | "top" | "bottom";
  readonlyInput?: boolean;
}

export const InputColor: React.FunctionComponent<InputColorProps> = props => {
  return (
    <React.Fragment>
      <input
        className="input__color"
        readOnly={!!props.readonlyInput}
        type="color"
        value={props.value ? props.value : ""}
        onChange={e => props.onChange(e, e.target.value)}
      />
      {props.label ? (
        <span className={`input__label${props.labelPos ? ` label_${props.labelPos}` : ""}`}>{props.label}</span>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};
