interface ArrowRightProps {
  size?: string;
  color?: string;
}

export function ArrowRight(props: ArrowRightProps) {
  return (
    <svg width={props.size ?? "16"} height={props.size ?? "16"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.7834 8L3 8M7.46566 13L13 8L7.46566 3" stroke={props.color ?? "var(--fg-header)"} />
    </svg>
  );
}
