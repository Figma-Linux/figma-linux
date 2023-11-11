export const getColorPallet = (theme: Themes.Theme) => {
  const props: string[] = [];

  for (const key of Object.keys(theme.palette)) {
    const prop = theme.palette[key];
    props.push(`--${key}: ${prop}`);
  }

  return props;
};
