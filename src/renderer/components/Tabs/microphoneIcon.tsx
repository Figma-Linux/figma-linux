import * as React from "react";

import { Icon } from "Elements";

interface Props {
  isUsingMicrophone: boolean;
  isInVoiceCall: boolean;
}

export const MicrophoneIcon: React.FunctionComponent<Props> | null = props => {
  let icon = <Icon type="Muted" />;

  if (props.isUsingMicrophone) {
    icon = <Icon type="UnMuted" />;
  }

  return props.isInVoiceCall ? icon : null;
};
