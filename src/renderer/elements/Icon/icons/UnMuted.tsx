import * as React from "react";

import { IconProps } from "..";
import "../index.css";

export const UnMuted: React.FunctionComponent<IconProps> = props => {
  const color = props.color ? props.color : "#1BC47D";

  return (
    <svg width="9" height="11" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 0C2.67157 0 2 0.671573 2 1.5V4.5C2 5.32843 2.67157 6 3.5 6C4.32843 6 5 5.32843 5 4.5V1.5C5 0.671573 4.32843 0 3.5 0ZM1 4.5V3.99997H0V4.5C0 6.26324 1.30385 7.72194 3 7.96456V9H2V10H3.5H5V9H4V7.96456C5.69614 7.72196 7 6.26326 7 4.50003V4H6V4.50003C6 5.88074 4.88071 7.00001 3.50001 7C2.11929 7 1 5.88071 1 4.5Z"
        fill={color}
      ></path>
    </svg>
  );
};
