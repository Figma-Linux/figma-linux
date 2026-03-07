interface CloseTabProps {
  size?: string;
  color?: string;
}

export function CloseTab(props: CloseTabProps) {
  return (
    <svg class="svg" width={props.size ?? "16"} height={props.size ?? "16"} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 4.143L9.857 3 7 5.857 4.143 3 3 4.143 5.857 7 3 9.857 4.143 11 7 8.143 9.857 11 11 9.857 8.143 7 11 4.143z"
        fill-rule="nonzero"
        fill-opacity="1"
        fill={props.color ?? "var(--fg-header)"}
        stroke="none"
      />
    </svg>
  );
}
