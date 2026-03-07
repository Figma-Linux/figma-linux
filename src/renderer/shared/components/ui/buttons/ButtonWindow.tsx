import { ParentProps, mergeProps } from 'solid-js';
import { Button } from './Button';

interface ButtonWindowProps extends ParentProps {
  padding?: string;
  normalBgColor?: string;
  activeBgColor?: string;
  hoverBgColor?: string;
  isActive?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export function ButtonWindow(props: ButtonWindowProps) {
  const merged = mergeProps(
    {
      padding: '0px 18px',
      normalBgColor: 'var(--bg-header-control)',
      activeBgColor: 'var(--bg-header-control-hover)',
      hoverBgColor: 'var(--bg-header-control-hover)',
      isActive: false,
    },
    props
  );

  return (
    <Button
      padding={merged.padding}
      normalBgColor={merged.normalBgColor}
      activeBgColor={merged.activeBgColor}
      hoverBgColor={merged.hoverBgColor}
      isActive={merged.isActive}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}
