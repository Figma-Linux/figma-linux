import * as React from "react";

import "../index.scss";

export interface InputRangeProps {
  onChange(event: React.MouseEvent<any> | React.ChangeEvent<any>, delta: number): void;
  value?: string | number;
  suffix?: string;
  displayLabel?: boolean;
  displayValue?: boolean;
  readonlyInput?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export const InputRange: React.FunctionComponent<InputRangeProps> = props => {
  return (
    <React.Fragment>
      <input
        className="input__range"
        readOnly={!!props.readonlyInput}
        type="range"
        min={props.min || 0}
        max={props.max || 100}
        step={props.step || 5}
        value={props.value ? props.value : ""}
        onChange={e => props.onChange(e, +e.target.value)}
      />
      {props.displayValue ? (
        <span className="input__label">
          {props.value}
          {props.suffix ? props.suffix : ""}
        </span>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};
