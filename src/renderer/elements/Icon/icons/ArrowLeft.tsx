import * as React from "react";

import { IconProps } from "..";
import "../index.scss";

export const ArrowLeft: React.FunctionComponent<IconProps> = props => {
  const size = props.size ? props.size : "16";
  const color = props.color ? props.color : "#7a7a7a";

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.21657 8H13M8.53434 3L3 8L8.53434 13" stroke={color} />
    </svg>
  );
};
