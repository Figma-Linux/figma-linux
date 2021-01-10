export const getColorPallet = (theme: Themes.Theme): React.CSSProperties => {
  const props = {} as CSSStyleDeclaration;

  for (const key of Object.keys(theme.palette)) {
    const prop = theme.palette[key];
    props[`--${key}`] = prop;
  }

  return props as React.CSSProperties;
};
