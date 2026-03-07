interface MenuCornerProps {
  size?: string;
  color?: string;
}

export function MenuCorner(props: MenuCornerProps) {
  return (
    <svg width={props.size ?? "16"} height={props.size ?? "16"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.34315 5.65685L8 11.3137L13.6569 5.65685" stroke={props.color ?? "var(--fg-header)"} />
    </svg>
  );
}
