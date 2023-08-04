import TTF from "./TTF";

const OFFSET_STORAGE = 12;

export default class TTC {
  private fontCount: number = 0;
  constructor(private buffer: Buffer, private offset: number = 0) {
    this.readHead();
  }

  private readHead() {
    const tag =
      String.fromCharCode(this.buffer[0]) +
      String.fromCharCode(this.buffer[1]) +
      String.fromCharCode(this.buffer[2]) +
      String.fromCharCode(this.buffer[3]);

    if (tag !== "ttcf") {
      throw new Error("Is not a TrueType font collection");
    }

    const o = this.offset;
    const majorVersion = this.buffer.readUInt16BE(o + 4);
    const minorVersion = this.buffer.readUInt16BE(o + 6);

    if ((majorVersion === 1 || majorVersion === 2) && minorVersion === 0) {
      this.fontCount = this.buffer.readUInt32BE(o + 8);
    }
  }

  public getData(): Fonts.IFontsFigmaItem[] {
    const o = OFFSET_STORAGE;
    const result: Fonts.IFontsFigmaItem[] = [];

    for (let i = 0; i < this.fontCount; i++) {
      const fontOffset = this.buffer.readUInt32BE(o + i * 4);
      const ttf = new TTF(this.buffer, fontOffset);

      result.push(ttf.getData());
    }

    return result;
  }
}
