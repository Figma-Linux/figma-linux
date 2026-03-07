interface PlusProps {
  size?: string;
  color?: string;
}

export function Plus(props: PlusProps) {
  return (
    <svg class="svg" width={props.size ?? "16"} height={props.size ?? "16"} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 6.5v1h4v4h1v-4h4v-1h-4v-4h-1v4h-4z" fill={props.color ?? "var(--fg-header)"} />
    </svg>
  );
}
