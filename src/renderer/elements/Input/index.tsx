import * as React from "react";

import { InputColor, InputColorProps } from "./types/Color";
import { InputRange, InputRangeProps } from "./types/Range";
import { InputText, InputTextProps } from "./types/Text";

import "./index.scss";

export interface InputBaseProps {
  className?: string;
}

export interface TextInputProps extends InputTextProps {
  type: "text";
}
export interface ColorProps extends InputColorProps {
  type: "color";
}
export interface RangeInputProps extends InputRangeProps {
  type: "range";
}

type InputsProps = (TextInputProps | RangeInputProps | ColorProps) & InputBaseProps;

export class Input extends React.Component<InputsProps, unknown> {
  private inputMap = {
    text: InputText,
    range: InputRange,
    color: InputColor,
  };

  constructor(props: InputsProps) {
    super(props);
  }

  render(): JSX.Element {
    const Input = this.inputMap[this.props.type];

    return (
      <div className={`input${this.props.className ? " " + this.props.className : ""}`}>
        <Input {...(this.props as any)} />
      </div>
    );
  }
}
