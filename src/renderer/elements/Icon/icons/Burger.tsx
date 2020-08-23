import * as React from "react";

import { IconProps } from "..";
import "../index.scss";

export const Burger: React.SFC<IconProps> = props => {
  const size = props.size ? props.size : "18";
  const color = props.color ? props.color : "#FFFFFF";

  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.7348 12.1818H3.28027V13H14.7348V12.1818ZM14.7348 8.09091H3.28027V8.90909H14.7348V8.09091ZM14.7348 4H3.28027V4.81818H14.7348V4Z"
        fill={color}
      />
    </svg>
  );
};
