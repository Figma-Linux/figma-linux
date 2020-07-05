import * as React from "react";

import "../index.scss";

export interface InputTextProps {
  onChange(event: React.MouseEvent<any> | React.ChangeEvent<any>, delta: number): void;
  value?: string | number;
  displayLabel?: boolean;
  suffix?: string;
  labelPos?: "left" | "right" | "top" | "bottom";
  contentBefore?: JSX.Element;
  contentAfter?: JSX.Element;
  placeholder?: string;
  readonlyInput?: boolean;
}

export const InputText: React.SFC<InputTextProps> = props => {
  return (
    <React.Fragment>
      {props.contentBefore ? <div className="input__content_before">{props.contentBefore}</div> : ""}
      <input
        className="input__text"
        readOnly={!!props.readonlyInput}
        placeholder={props.placeholder}
        type="text"
        value={props.value ? props.value : ""}
        onChange={e => props.onChange(e, +e.target.value)}
      />
      {props.displayLabel ? (
        <span className={`input__label${props.labelPos ? ` label_${props.labelPos}` : ""}`}>
          {props.value}
          {props.suffix ? props.suffix : ""}
        </span>
      ) : (
        ""
      )}
      {props.contentAfter ? <div className="input__content_after">{props.contentAfter}</div> : ""}
    </React.Fragment>
  );
};
