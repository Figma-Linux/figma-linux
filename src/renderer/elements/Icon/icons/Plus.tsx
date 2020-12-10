import * as React from "react";

import { IconProps } from "..";
import "../index.scss";

export const Plus: React.FunctionComponent<IconProps> = props => {
  const size = props.size ? props.size : "16";
  const color = props.color ? props.color : "#7a7a7a";

  return (
    <svg className="svg" width={size} height={size} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 6.5v1h4v4h1v-4h4v-1h-4v-4h-1v4h-4z" fill={color} />
    </svg>
  );
};
