import * as React from "react";

import { IconProps } from "..";
import "../index.scss";

export const Restore: React.FunctionComponent<IconProps> = props => {
  const size = props.size ? props.size : "16";
  const color = props.color ? props.color : "#7a7a7a";

  return (
    <svg viewBox="0 0 16 16" fill="none" height={size} width={size} xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        <path d="M3 5v9h9V5H3zm8 8H4V6h7v7z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M5 5h1V4h7v7h-1v1h2V3H5v2z" />
      </g>
    </svg>
  );
};
