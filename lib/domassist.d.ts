/**
 * Provides multiple helper functions for JS DOM operations.
 * @public
 */
declare module "domassist" {
  /**
   * Finds all DOM elements matching a selector and scope.
   *
   * @param selector - The element(s) to find in the DOM.
   * @param context - The parent element or identifier to set the scope.
   * @returns The array of matching elements.
   */
  export function find(
    selector: string | HTMLElement | NodeList,
    context?: HTMLElement
  ): Array<HTMLElement>;

  /**
   * Finds the first matching DOM element in a selector's scope.
   *
   * @param selector - The element to find in the DOM.
   * @param context - The parent element or identifier to set the scope.
   * @returns The matching element, or null if none are found.
   */
  export function findOne(
    selector: string,
    context?: HTMLElement
  ): HTMLElement | null;

  /**
   * Binds an event callback to one or more elements matching a selector.
   *
   * @param selector - The element to bind in the DOM.
   * @param event - The event type to listen.
   * @param callback - The function to call on event trigger.
   * @param capture - Determines which phase to attach the event. Defaults to `false`, or the "bubble" phase; `true` binds it to the capture phase.
   */
  export function on(
    selector: string | HTMLElement | NodeList,
    event: string,
    callback: (e: Event) => void,
    capture?: boolean
  ): void;
}
