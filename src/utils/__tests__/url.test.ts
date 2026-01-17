import { describe, it, expect } from 'vitest';
import {
  isFigmaUrl,
  isCommunityUrl,
  isPrototypeUrl,
  parseURL,
  isValidProjectLink,
  isValidFigjamLink,
  isRecentFilesLink,
  isFigmaDocLink,
  isFigmaBoardLink,
  isFigmaDesignLink,
} from '../Common/url';

describe('URL utilities', () => {
  describe('isFigmaUrl', () => {
    it('returns true for valid figma.com URLs', () => {
      expect(isFigmaUrl('https://figma.com/file/abc123')).toBe(true);
      expect(isFigmaUrl('https://www.figma.com/file/abc123')).toBe(true);
      expect(isFigmaUrl('http://figma.com/files/recent')).toBe(true);
    });

    it('returns false for non-figma URLs', () => {
      expect(isFigmaUrl('https://google.com')).toBe(false);
      expect(isFigmaUrl('https://notfigma.com')).toBe(false);
      expect(isFigmaUrl('')).toBe(false);
    });
  });

  describe('isCommunityUrl', () => {
    it('returns true for community URLs', () => {
      expect(isCommunityUrl('https://www.figma.com/community/plugin/123')).toBe(true);
      expect(isCommunityUrl('https://figma.com/community/file/456')).toBe(true);
    });

    it('returns false for non-community URLs', () => {
      expect(isCommunityUrl('https://figma.com/file/abc')).toBe(false);
      expect(isCommunityUrl('https://google.com')).toBe(false);
    });
  });

  describe('isPrototypeUrl', () => {
    it('returns true for prototype URLs with node-id', () => {
      expect(isPrototypeUrl('https://figma.com/proto/abc123/name?node-id=1:2')).toBe(true);
    });

    it('returns false for non-prototype URLs', () => {
      expect(isPrototypeUrl('https://figma.com/file/abc123')).toBe(false);
      expect(isPrototypeUrl('https://figma.com/proto/abc123')).toBe(false);
    });
  });

  describe('parseURL', () => {
    it('parses valid URLs', () => {
      const result = parseURL('https://figma.com/file/abc');
      expect(result).toBeDefined();
      expect(result?.hostname).toBe('figma.com');
    });

    it('returns undefined for invalid URLs', () => {
      expect(parseURL('not-a-url')).toBeUndefined();
      expect(parseURL('')).toBeUndefined();
    });
  });

  describe('isValidProjectLink', () => {
    it('returns true for valid project links', () => {
      expect(isValidProjectLink('https://figma.com/file/abc123')).toBe(true);
      expect(isValidProjectLink('https://www.figma.com/file/abc123')).toBe(true);
    });

    it('returns false for invalid project links', () => {
      expect(isValidProjectLink('https://figma.com/community/plugin')).toBe(false);
    });
  });

  describe('isValidFigjamLink', () => {
    it('returns true for FigJam links', () => {
      expect(isValidFigjamLink('https://figma.com/jam/abc123')).toBe(true);
    });

    it('returns false for non-FigJam links', () => {
      expect(isValidFigjamLink('https://figma.com/file/abc123')).toBe(false);
    });
  });

  describe('isRecentFilesLink', () => {
    it('returns true for recent files links', () => {
      expect(isRecentFilesLink('https://figma.com/files/recent')).toBe(true);
      expect(isRecentFilesLink('figma://files/recent')).toBe(true);
    });
  });

  describe('isFigmaDocLink', () => {
    it('returns true for plugin docs links', () => {
      expect(isFigmaDocLink('https://www.figma.com/plugin-docs/intro')).toBe(true);
    });

    it('returns false for non-doc links', () => {
      expect(isFigmaDocLink('https://figma.com/file/abc')).toBe(false);
    });
  });

  describe('isFigmaBoardLink', () => {
    it('returns true for board links', () => {
      expect(isFigmaBoardLink('https://www.figma.com/board/abc123')).toBe(true);
    });
  });

  describe('isFigmaDesignLink', () => {
    it('returns true for design links', () => {
      expect(isFigmaDesignLink('https://www.figma.com/design/abc123')).toBe(true);
    });
  });
});
