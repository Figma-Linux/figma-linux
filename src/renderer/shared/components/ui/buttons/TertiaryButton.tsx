import { ParentProps, mergeProps } from 'solid-js';
import { Button } from './Button';

interface TertiaryButtonProps extends ParentProps {
  padding?: string;
  normalFgColor?: string;
  activeFgColor?: string;
  normalBgColor?: string;
  activeBgColor?: string;
  hoverBgColor?: string;
  isActive?: boolean;
  normalBorder?: string;
  activeBorder?: string;
  hoverBorder?: string;
  normalCursor?: string;
  activeCursor?: string;
  hoverCursor?: string;
  onClick?: (event: MouseEvent) => void;
}

export function TertiaryButton(props: TertiaryButtonProps) {
  const merged = mergeProps(
    {
      padding: '0 7px',
      normalFgColor: 'var(--text)',
      activeFgColor: 'var(--fg-toolbar-active)',
      normalBgColor: 'transparent',
      activeBgColor: 'var(--bg-toolbar-active)',
      hoverBgColor: 'transparent',
      isActive: false,
      normalBorder: '1px solid var(--text)',
      activeBorder: '1px solid var(--bg-toolbar-active)',
      hoverBorder: '1px solid var(--text)',
      normalCursor: 'pointer',
      activeCursor: 'pointer',
      hoverCursor: 'pointer',
    },
    props
  );

  return (
    <Button
      padding={merged.padding}
      normalFgColor={merged.normalFgColor}
      activeFgColor={merged.activeFgColor}
      normalBgColor={merged.normalBgColor}
      activeBgColor={merged.activeBgColor}
      hoverBgColor={merged.hoverBgColor}
      isActive={merged.isActive}
      normalBorder={merged.normalBorder}
      activeBorder={merged.activeBorder}
      hoverBorder={merged.hoverBorder}
      normalCursor={merged.normalCursor}
      activeCursor={merged.activeCursor}
      hoverCursor={merged.hoverCursor}
      onClick={props.onClick}
      round={3}
      height="36px"
    >
      {props.children}
    </Button>
  );
}
