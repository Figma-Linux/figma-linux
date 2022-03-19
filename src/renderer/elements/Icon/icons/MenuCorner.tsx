import * as React from "react";

import { IconProps } from "..";
import "../index.css";

export const MenuCorner: React.FunctionComponent<IconProps> = props => {
  const size = props.size ? props.size : "16";
  const color = props.color ? props.color : "#7a7a7a";

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.34315 5.65685L8 11.3137L13.6569 5.65685" stroke={color} />
    </svg>
  );
};
