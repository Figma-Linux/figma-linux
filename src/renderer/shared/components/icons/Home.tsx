interface HomeProps {
  size?: string;
  color?: string;
}

export function Home(props: HomeProps) {
  return (
    <svg width={props.size ?? "16"} height={props.size ?? "16"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 9.2L8 2L14 9.2V14H9.71429V10.4H6.28571V14H2V9.2Z" fill={props.color ?? "var(--fg-header)"} />
    </svg>
  );
}
