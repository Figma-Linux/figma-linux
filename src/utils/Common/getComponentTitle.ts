export const getComponentTitle = (url: string): string => url.substr(url.search(/\/\//) + 2);
