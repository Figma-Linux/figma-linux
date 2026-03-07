interface BurgerProps {
  size?: string;
  color?: string;
}

export function Burger(props: BurgerProps) {
  return (
    <svg width={props.size ?? "16"} height={props.size ?? "16"} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.7348 12.1818H3.28027V13H14.7348V12.1818ZM14.7348 8.09091H3.28027V8.90909H14.7348V8.09091ZM14.7348 4H3.28027V4.81818H14.7348V4Z"
        fill={props.color ?? "var(--fg-header)"}
      />
    </svg>
  );
}
