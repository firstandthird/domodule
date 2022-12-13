declare module "attrobj" {
  export interface AttrObj {
    [index: string]: string;
  }

  export default function (key: string, el: HTMLElement): AttrObj;
}
