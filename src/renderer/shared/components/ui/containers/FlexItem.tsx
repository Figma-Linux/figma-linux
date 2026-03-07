import { ParentProps, mergeProps } from 'solid-js';

interface FlexItemProps extends ParentProps {
  grow?: number;
  flex?: number;
}

export function FlexItem(props: FlexItemProps) {
  const merged = mergeProps({ grow: 0, flex: 0 }, props);

  return (
    <div
      style={{
        flex: merged.flex,
        'flex-grow': merged.grow,
      }}
    >
      {props.children}
    </div>
  );
}
