const TABLE_HEAD_OFFSET = 12;
const TABLE_HEAD_SIZE = 16;
const TAG_OFFSET = 0;
const TAG_SIZE = 4;
const CHECKSUM_OFFSET = TAG_OFFSET + TAG_SIZE;
const CHECKSUM_SIZE = 4;
const CONTENTS_PTR_OFFSET = CHECKSUM_OFFSET + CHECKSUM_SIZE;
const CONTENTS_PTR_SIZE = 4;
const LENGTH_OFFSET = TABLE_HEAD_SIZE + CONTENTS_PTR_OFFSET;
const VERSION_OFFSET = 0;
const WEIGHT_CLASS_OFFSET = 4;
const FORMAT_OFFSET = 0;
const ITALIC_ANGLE_OFFSET = FORMAT_OFFSET + 4;
const UNDERLINE_POSITION_OFFSET = ITALIC_ANGLE_OFFSET + 8;
const UNDERLINE_THICKNESS_OFFSET = UNDERLINE_POSITION_OFFSET + 2;
const IS_FIXED_PITCH_OFFSET = UNDERLINE_THICKNESS_OFFSET + 2;

export default class TTF {
  private tableCount: number = 0;
  private tableMap = new Map<string, Fonts.TableName>();
  constructor(private buffer: Buffer, private offset: number = 0) {
    this.readHead();
    this.readTablesInfo();
  }

  private readTablesInfo() {
    for (let i = 0; i < this.tableCount; ++i) {
      const o = this.offset + TABLE_HEAD_OFFSET + i * TABLE_HEAD_SIZE;
      const tag = this.buffer.subarray(o, o + CONTENTS_PTR_SIZE).toString();

      this.tableMap.set(tag, {
        checksum: this.buffer.readUInt32BE(o + CHECKSUM_OFFSET),
        contents: this.buffer.readUInt32BE(o + CONTENTS_PTR_OFFSET),
        length: this.buffer.readUInt32BE(o + LENGTH_OFFSET),
      });
    }
  }

  private readHead() {
    const o = this.offset;
    const majorVersion = this.buffer.readUInt16BE(o);
    const minorVersion = this.buffer.readUInt16BE(o + 2);

    if (majorVersion != 1 || minorVersion != 0) {
      const tag =
        String.fromCharCode(this.buffer[o]) +
        String.fromCharCode(this.buffer[o + 1]) +
        String.fromCharCode(this.buffer[o + 2]) +
        String.fromCharCode(this.buffer[o + 3]);

      if (!["OTTO", "true", "ttcf"].includes(tag)) {
        throw new Error("Is not a TrueType font");
      }
    }

    this.tableCount = this.buffer.readUInt16BE(o + 4);
  }
  public getNameTable(): Fonts.NameTableResult {
    const tableNameInfo = this.tableMap.get("name");
    const ntOffset = tableNameInfo.contents;
    const tableVersion = this.buffer.readUInt16BE(ntOffset);
    const numberNameRecords = this.buffer.readUInt16BE(ntOffset + 2);
    const offsetStorage = this.buffer.readUInt16BE(ntOffset + 4);

    if (tableVersion != 0 && tableVersion != 1) {
      throw new Error('Invalid the "name" table');
    }
    const storage = offsetStorage + ntOffset;

    const info: any = {};
    for (let j = 0; j < numberNameRecords; j++) {
      const o = ntOffset + 6 + j * 12;

      const platformId = this.buffer.readUInt16BE(o);
      const nameId: string | number = this.buffer.readUInt16BE(o + 6);
      const stringLength = this.buffer.readUInt16BE(o + 8);
      const stringOffset = this.buffer.readUInt16BE(o + 10);

      const fieldNames = [
        "copyright",
        "fontFamily",
        "fontSubFamily",
        "fontIdentifier",
        "fontName",
        "fontVersion",
        "postscriptName",
        "trademark",
        "manufacturer",
        "designer",
        "description",
        "vendorURL",
        "designerURL",
        "license",
        "licenseURL",
        "reserved",
        "preferredFamily",
        "preferredSubFamily",
        "compatibleFullName",
        "sampleText",
        "postScriptCIDfindfontName",
        "WWSFamilyName",
        "WWSSubFamilyName",
      ];
      const name = fieldNames[nameId] ? fieldNames[nameId] : "";

      if (!info[name]) {
        info[name] = "";

        for (let k = 0; k < stringLength; k++) {
          const charCode = this.buffer[storage + stringOffset + k];
          if (charCode === 0) continue;
          info[name] += String.fromCharCode(charCode);
        }
      }
    }

    return info;
  }

  public getPostTable() {
    const o = this.tableMap.get("post").contents;

    return {
      format: this.fixed16dot16(this.buffer.readUInt32BE(o + FORMAT_OFFSET)),
      italicAngle: this.fixed16dot16(this.buffer.readUInt32BE(o + ITALIC_ANGLE_OFFSET)),
      underlinePosition: this.buffer.readInt16BE(o + UNDERLINE_POSITION_OFFSET),
      underlineThickness: this.buffer.readInt16BE(o + UNDERLINE_THICKNESS_OFFSET),
      isFixedPitch: this.buffer.readUInt32BE(o + IS_FIXED_PITCH_OFFSET),
      minMemType42: this.buffer.readUInt32BE(o + 7),
      maxMemType42: this.buffer.readUInt32BE(o + 9),
      minMemType1: this.buffer.readUInt32BE(o + 11),
      maxMemType1: this.buffer.readUInt32BE(o + 13),
    };
  }
  public getOS2Table() {
    const o = this.tableMap.get("OS/2")?.contents;

    return {
      version: o ? this.buffer.readUInt16BE(o + VERSION_OFFSET) : 0,
      weightClass: o ? this.buffer.readUInt16BE(o + WEIGHT_CLASS_OFFSET) : 0,
    };
  }

  public getData(): Fonts.IFontsFigmaItem {
    const nameTable = this.getNameTable();
    const os2Table = this.getOS2Table();

    return {
      postscript: nameTable.postscriptName,
      family: nameTable.fontFamily,
      id: nameTable.fontFamily,
      style: nameTable.fontSubFamily ?? nameTable.fontFamily,
      weight: os2Table.weightClass,
      stretch: 5,
      italic: nameTable.fontSubFamily === "Italic",
    };
  }

  private fixed16dot16(fixed: number) {
    if (fixed & 0x80000000) {
      fixed = -(~fixed + 1);
    }

    return fixed / 65536;
  }
}
