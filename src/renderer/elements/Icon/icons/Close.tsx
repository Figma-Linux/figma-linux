import * as React from "react";

import { IconProps } from "..";
import "../index.scss";

export const Close: React.FunctionComponent<IconProps> = props => {
  const size = props.size ? props.size : "16";
  const color = props.color ? props.color : "#2C2C2C";

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884L7.116 8z"
        />
      </g>
    </svg>
  );
};
