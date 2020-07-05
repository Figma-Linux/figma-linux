import * as React from "react";

// import { InputNumber, InputNumberProps } from "./types/Number";
import { InputRange, InputRangeProps } from "./types/Range";
import { InputText, InputTextProps } from "./types/Text";

import "./index.scss";

export enum InputTypes {
  Text = "Text",
  // Number = "Number", // Not used
  Range = "Range",
}

export interface InputBaseProps {
  className?: string;
}

export interface TextInputProps extends InputTextProps {
  type: InputTypes.Text;
}
// export interface NumberProps extends InputNumberProps {
//   type: InputTypes.Number;
// }
export interface RangeInputProps extends InputRangeProps {
  type: InputTypes.Range;
}

type InputsProps = (TextInputProps | RangeInputProps) & InputBaseProps;

export class Input extends React.Component<InputsProps, {}> {
  private inputMap = {
    Text: InputText,
    Range: InputRange,
  };

  constructor(props: InputsProps) {
    super(props);
  }

  render(): JSX.Element {
    const Input = this.inputMap[this.props.type];

    return (
      <div className={`input${this.props.className ? " " + this.props.className : ""}`}>
        <Input {...this.props} />
      </div>
    );
  }
}
