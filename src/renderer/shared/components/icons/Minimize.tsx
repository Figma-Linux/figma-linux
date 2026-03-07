interface MinimizeProps {
  size?: string;
  color?: string;
}

export function Minimize(props: MinimizeProps) {
  return (
    <svg width={props.size ?? "16"} height={props.size ?? "16"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12.277H13" />
      <g fill={props.color ?? "var(--fg-header)"}>
        <path d="M14 8v1H3V8h11z" />
      </g>
    </svg>
  );
}
