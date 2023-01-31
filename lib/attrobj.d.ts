/**
 * Creates an object from a data attribute key on an element.
 * @public
 */
declare module "attrobj" {
  /** The generic structure of an attribute object. */
  export interface AttrObj {
    [index: string]: string;
  }

  /**
   * Creates an object from a data attribute key on an element.
   *
   * @param key - The attribute prefix to search, assuming the format `data-key-*`.
   * @param el - The element to search.
   * @returns An object made of data attribute key-value pairs.
   */
  export default function (key: string, el: HTMLElement): AttrObj;
}
