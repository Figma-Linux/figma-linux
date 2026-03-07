interface CloseProps {
  size?: string;
  color?: string;
}

export function Close(props: CloseProps) {
  return (
    <svg width={props.size ?? "16"} height={props.size ?? "16"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={props.color ?? "var(--fg-header)"}>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884L7.116 8z"
        />
      </g>
    </svg>
  );
}
