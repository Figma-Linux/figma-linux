declare namespace Fonts {
  interface IFontsFigmaItem {
    postscript: string;
    family: string;
    id: string;
    style: string;
    weight: number;
    stretch: number;
    italic: boolean;
  }

  interface IFonts {
    [path: string]: Array<IFontsFigmaItem>;
  }

  interface NameTableResult {
    copyright: string;
    fontFamily: string;
    fontSubFamily?: string;
    fontIdentifier?: string;
    fontName: string;
    fontVersion: string;
    postscriptName: string;
    trademark?: string;
    manufacturer?: string;
    designer?: string;
    description?: string;
    vendorURL?: string;
    designerURL?: string;
    license?: string;
    licenseURL?: string;
    reserved?: string;
    preferredFamily?: string;
    preferredSubFamily?: string;
    compatibleFullName?: string;
    sampleText?: string;
    postScriptCIDfindfontName?: string;
    WWSFamilyName?: string;
    WWSSubFamilyName?: string;
  }

  interface TableName {
    checksum: number;
    contents: number;
    length: number;
  }
}
