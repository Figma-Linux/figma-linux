interface ArrowLeftProps {
  size?: string;
  color?: string;
}

export function ArrowLeft(props: ArrowLeftProps) {
  return (
    <svg width={props.size ?? "16"} height={props.size ?? "16"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.21657 8H13M8.53434 3L3 8L8.53434 13" stroke={props.color ?? "var(--fg-header)"} />
    </svg>
  );
}
