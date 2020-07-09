import * as React from "react";

import { IconProps } from "..";
import "../index.scss";

export const Maximize: React.SFC<IconProps> = props => {
  const size = props.size ? props.size : "16";
  const color = props.color ? props.color : "#7a7a7a";

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="5.5" width="7" height="7" stroke={color} />
      <line x1="5.5" y1="6" x2="5.5" y2="3" stroke={color} />
      <line x1="6" y1="3.5" x2="13" y2="3.5" stroke={color} />
      <line x1="12.5" y1="4" x2="12.5" y2="11" stroke={color} />
      <line x1="12" y1="10.5" x2="10" y2="10.5" stroke={color} />
    </svg>
  );
};
