import * as React from "react";

import { IconProps } from "..";
import "../index.css";

export const ArrowRight: React.FunctionComponent<IconProps> = props => {
  const size = props.size ? props.size : "16";
  const color = props.color ? props.color : "#333333";

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.7834 8L3 8M7.46566 13L13 8L7.46566 3" stroke={color} />
    </svg>
  );
};
