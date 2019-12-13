/**
 * Copyright 2018 Chugunov Roman
 *
 * Licensed under the MIT license.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * ShortcutMan is a simple keyboard shortcut library for JavaScript with
 * no external dependencies. Writed with TypeScript.
 *
 * @version 1.0.0
 */

interface Sequence {
  sequence: string;
  callback: Function;
}

/**
 * Singleton for register shortcuts in window
 */
export class ShortcutMan {
  private static _instance: ShortcutMan;
  private sequenceMap: Array<Sequence> = [];
  private shiftMap: any = {
    "~": "`",
    "!": "1",
    "@": "2",
    "#": "3",
    $: "4",
    "%": "5",
    "^": "6",
    "&": "7",
    "*": "8",
    "(": "9",
    ")": "0",
    _: "-",
    "+": "=",
    "|": "\\",
    "}": "]",
    "{": "[",
    '"': "'",
    ":": ";",
    "?": "/",
    ">": ".",
    "<": ",",
  };

  /**
   * Register event handler
   */
  private constructor() {
    window.addEventListener("keydown", event => {
      const key = event.key.toLocaleLowerCase();
      const pressedSequence: Array<string> = [];

      if (event.shiftKey) {
        pressedSequence.push("shift");
      }
      if (event.altKey) {
        pressedSequence.push("alt");
      }
      if (event.ctrlKey) {
        pressedSequence.push("ctrl");
      }
      if (event.metaKey) {
        pressedSequence.push("meta");
      }

      if (key !== "control" && key !== "alt" && key !== "shift" && key !== "meta") {
        // If pressed the shift key
        if (event.shiftKey && this.shiftMap[key]) {
          pressedSequence.push(this.shiftMap[key]);
        } else {
          pressedSequence.push(key);
        }
      }

      const _sequence = this.sort(pressedSequence.join("+"));
      const sequence = this.sequenceMap.find(item => item.sequence === _sequence);

      if (!sequence) return;

      sequence.callback();
    });
  }

  /**
   * Adding the sequence and the callback
   * to the sequence collection
   */
  public bind = (sequence: string, cb: Function) => {
    if (sequence === "") return;

    this.sequenceMap.push({
      sequence: this.sort(sequence),
      callback: cb,
    });
  };

  /**
   * Deleting a sequence fron the sequence collection
   */
  public unbind = (sequence: string) => {
    const _sequence = this.sort(sequence);

    this.sequenceMap = this.sequenceMap.filter(item => item.sequence !== _sequence);
  };

  /**
   * Getting instance
   */
  public static get instance() {
    if (ShortcutMan._instance) {
      return ShortcutMan._instance;
    }

    return new ShortcutMan();
  }

  /**
   * Checking the transmitted key sequence to uniqueness.
   * If function returned the false, that transmitted sequence was be found.
   * If function returned true, that transmitted sequence is unique.
   */
  public checkForUniqueness = (sequence: string): boolean => {
    const _sequence = this.sort(sequence);
    const index = this.sequenceMap.findIndex(item => item.sequence === _sequence);

    return index === -1 ? true : false;
  };

  /**
   * Sorting sequence
   */
  private sort = (sequence: string) => {
    return sequence
      .split("+")
      .sort((a, b) => (a.length > b.length ? -1 : 1))
      .join("+")
      .toLocaleLowerCase();
  };
}

export default ShortcutMan.instance;
