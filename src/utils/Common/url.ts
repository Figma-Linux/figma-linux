import * as Url from "url";
import { PROTOCOL, HOMEPAGE } from "Const";

export const isComponentUrl = (url: string): boolean => /^component:\/\/\w+/.test(url);

export const isRedeemAuthUrl = (url: string): boolean => /[a-z]{4,5}:\/\/app_auth\/redeem.+/.test(url);

export const isFigmaProtocolUrl = (url: string): boolean => {
  const regex = new RegExp(`^${PROTOCOL}://.+`);

  return regex.test(url);
};

export const normalizeUrl = (url: string): string => {
  if (!isFigmaProtocolUrl(url)) {
    return url;
  }

  const replaceRegExp = new RegExp(`^${PROTOCOL}:/`);

  return url.replace(replaceRegExp, HOMEPAGE);
};

export const getParsedUrl = (data: string): Url.UrlWithStringQuery => {
  let url = data;

  if (isFigmaProtocolUrl(url)) {
    url = normalizeUrl(url);
  }

  return Url.parse(url);
};

export const isAppAuthGrandLink = (url: string) => /\/app_auth\/.*\/grant/.test(url);

export const isAppAuthLink = (url: string) => /figma:\/\/app_auth\/redeem\?g_secret=.*/.test(url);

export const isValidProjectLink = (url: string) => /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com)/.test(url);

export const isProtoLink = (url: string) => /^https:\/\/w{0,3}?.figma.com\/proto/.test(url);
