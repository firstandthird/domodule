declare module "domassist" {
  export function find(
    selector: string | HTMLElement | NodeList,
    context?: HTMLElement
  ): Array<HTMLElement>;

  export function findOne(
    selector: string,
    context?: HTMLElement
  ): HTMLElement | null;

  export function on(
    selector: string | HTMLElement | NodeList,
    event: string,
    callback: (e: Event) => void,
    capture?: boolean
  ): void;
}
