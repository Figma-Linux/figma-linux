interface CornerProps {
  size?: string;
  color?: string;
}

export function Corner(props: CornerProps) {
  return (
    <svg width={props.size ?? "16"} height={props.size ?? "16"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 6.48529L6.65685 12.1421L12.3137 6.48529" stroke={props.color ?? "var(--fg-header)"} />
    </svg>
  );
}
