import { ParentProps, mergeProps } from 'solid-js';
import { Button } from './Button';

interface SecondaryButtonProps extends ParentProps {
  padding?: string;
  width?: string;
  height?: string;
  normalFgColor?: string;
  hoverFgColor?: string;
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

export function SecondaryButton(props: SecondaryButtonProps) {
  const merged = mergeProps(
    {
      padding: '0 7px',
      width: 'auto',
      height: '36px',
      normalFgColor: 'var(--text)',
      hoverFgColor: 'var(--text-active)',
      normalBgColor: 'transparent',
      activeBgColor: 'transparent',
      hoverBgColor: 'transparent',
      isActive: false,
      normalBorder: '1px solid var(--text)',
      activeBorder: '1px solid var(--text-active)',
      hoverBorder: '1px solid var(--text-active)',
      normalCursor: 'pointer',
      activeCursor: 'pointer',
      hoverCursor: 'pointer',
    },
    props
  );

  return (
    <Button
      padding={merged.padding}
      width={merged.width}
      height={merged.height}
      normalFgColor={merged.normalFgColor}
      hoverFgColor={merged.hoverFgColor}
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
