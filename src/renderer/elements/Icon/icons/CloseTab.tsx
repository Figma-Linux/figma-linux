import * as React from "react";

import { IconProps } from "..";
import "../index.scss";

export const CloseTab: React.FunctionComponent<IconProps> = props => {
  const size = props.size ? props.size : "16";
  const color = props.color ? props.color : "#2C2C2C";

  return (
    <svg className="svg" width={size} height={size} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 4.143L9.857 3 7 5.857 4.143 3 3 4.143 5.857 7 3 9.857 4.143 11 7 8.143 9.857 11 11 9.857 8.143 7 11 4.143z"
        fillRule="nonzero"
        fillOpacity="1"
        fill={color}
        stroke="none"
      ></path>
    </svg>
  );
};
