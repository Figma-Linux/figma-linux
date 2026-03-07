import { ParentProps, mergeProps } from 'solid-js';
import { Button } from './Button';

interface PrimaryButtonProps extends ParentProps {
  width?: string;
  height?: string;
  margin?: string;
  padding?: string;
  normalFgColor?: string;
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

export function PrimaryButton(props: PrimaryButtonProps) {
  const merged = mergeProps(
    {
      width: 'inherit',
      height: '36px',
      margin: 'inherit',
      padding: '0 7px',
      normalFgColor: 'var(--fg-toolbar-active)',
      normalBgColor: 'var(--bg-toolbar-active)',
      activeBgColor: 'var(--bg-toolbar-active)',
      hoverBgColor: 'var(--bg-toolbar-active)',
      isActive: false,
      normalBorder: 'none',
      activeBorder: 'none',
      hoverBorder: 'none',
      normalCursor: 'pointer',
      activeCursor: 'pointer',
      hoverCursor: 'pointer',
    },
    props
  );

  return (
    <Button
      width={merged.width}
      height={merged.height}
      margin={merged.margin}
      padding={merged.padding}
      normalFgColor={merged.normalFgColor}
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
    >
      {props.children}
    </Button>
  );
}
