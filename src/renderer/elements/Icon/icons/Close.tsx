import * as React from "react";

import { IconProps } from "..";
import "../index.scss";

export const Close: React.FunctionComponent<IconProps> = props => {
  const size = props.size ? props.size : "16";
  const color = props.color ? props.color : "#2C2C2C";

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L4.00007 12M4 4L11.9999 12" stroke={color} />
    </svg>
  );
};
