interface MaximizeProps {
  size?: string;
  color?: string;
}

export function Maximize(props: MaximizeProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" height={props.size ?? "16"} width={props.size ?? "16"} xmlns="http://www.w3.org/2000/svg">
      <g fill={props.color ?? "var(--fg-header)"}>
        <path d="M3 3v10h10V3H3zm9 9H4V4h8v8z" />
      </g>
    </svg>
  );
}
