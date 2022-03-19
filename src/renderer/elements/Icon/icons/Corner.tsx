import * as React from "react";

import { IconProps } from "..";
import "../index.css";

export const Corner: React.FunctionComponent<IconProps> = props => {
  const size = props.size ? props.size : "16";
  const color = props.color ? props.color : "#333333";

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 6.48529L6.65685 12.1421L12.3137 6.48529" stroke={color} />
    </svg>
  );
};
