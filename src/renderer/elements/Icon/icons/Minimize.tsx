import * as React from "react";

import { IconProps } from "..";
import "../index.scss";

export const Minimize: React.SFC<IconProps> = props => {
  const size = props.size ? props.size : "16";

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12.277H13" stroke={props.color ? props.color : "#7a7a7a"} />
    </svg>
  );
};
