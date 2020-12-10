import * as React from "react";

import { IconProps } from "..";
import "../index.scss";

export const Delete: React.FunctionComponent<IconProps> = props => {
  const size = props.size ? props.size : "18";
  const color = props.color ? props.color : "#FFFFFF";

  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.75 4.5H16.5V6H15V15.75C15 15.9489 14.921 16.1397 14.7803 16.2803C14.6397 16.421 14.4489 16.5 14.25 16.5H3.75C3.55109 16.5 3.36032 16.421 3.21967 16.2803C3.07902 16.1397 3 15.9489 3 15.75V6H1.5V4.5H5.25V2.25C5.25 2.05109 5.32902 1.86032 5.46967 1.71967C5.61032 1.57902 5.80109 1.5 6 1.5H12C12.1989 1.5 12.3897 1.57902 12.5303 1.71967C12.671 1.86032 12.75 2.05109 12.75 2.25V4.5ZM13.5 6H4.5V15H13.5V6ZM6.75 3V4.5H11.25V3H6.75Z"
        fill={color}
      />
    </svg>
  );
};
