import * as React from "react";

import { IconProps } from "..";
import "../index.css";

export const Maximize: React.FunctionComponent<IconProps> = props => {
  const size = props.size ? props.size : "16";
  const color = props.color ? props.color : "#7a7a7a";

  return (
    <svg viewBox="0 0 16 16" fill="none" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        <path d="M3 3v10h10V3H3zm9 9H4V4h8v8z" />
      </g>
    </svg>
  );
};
