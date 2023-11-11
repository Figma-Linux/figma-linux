export function keysToCamelCase<T extends Types.Dic<string>>(input: T): T {
  const keys = Object.keys(input);
  const output: Types.Dic<string> = {};

  for (const key of keys) {
    const value = input[key];
    const newKey = key.replace(/-([a-z])/g, (s) => s.replace("-", "").toUpperCase());

    output[newKey] = value;
  }

  return output as T;
}

export function keysToKebabCase<T extends Types.Dic<string>>(input: T): T {
  const keys = Object.keys(input);
  const output: Types.Dic<string> = {};

  for (const key of keys) {
    const value = input[key];
    const newKey = key.replace(/([A-Z])/gm, "-$1").toLowerCase();

    output[newKey] = value;
  }

  return output as T;
}
