import * as React from "react";

import { IconProps } from "..";
import "../index.css";

export const Component: React.FunctionComponent<IconProps> = props => {
  const size = props.size ? props.size : "18";
  const color = props.color ? props.color : "#FFFFFF";

  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="3.30672"
        y="9"
        width="2.85709"
        height="2.85709"
        rx="0.5"
        transform="rotate(-45 3.30672 9)"
        stroke={color}
      />
      <rect
        x="6.94343"
        y="5.36353"
        width="2.85709"
        height="2.85709"
        rx="0.5"
        transform="rotate(-45 6.94343 5.36353)"
        stroke={color}
      />
      <rect
        x="10.5792"
        y="9"
        width="2.85709"
        height="2.85709"
        rx="0.5"
        transform="rotate(-45 10.5792 9)"
        stroke={color}
      />
      <rect
        x="6.94343"
        y="12.6365"
        width="2.85709"
        height="2.85709"
        rx="0.5"
        transform="rotate(-45 6.94343 12.6365)"
        stroke={color}
      />
    </svg>
  );
};
