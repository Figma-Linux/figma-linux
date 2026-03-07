interface CloseModalProps {
  size?: string;
  color?: string;
}

export function CloseModal(props: CloseModalProps) {
  return (
    <svg class="svg" width={props.size ?? "12"} height={props.size ?? "12"} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 5.293l4.789-4.79.707.708-4.79 4.79 4.79 4.789-.707.707-4.79-4.79-4.789 4.79-.707-.707L5.293 6 .502 1.211 1.21.504 6 5.294z"
        fill-rule="nonzero"
        fill-opacity="1"
        fill={props.color ?? "var(--fg-header)"}
        stroke="none"
      />
    </svg>
  );
}
