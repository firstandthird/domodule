/** @module parentModule */

/**
 * Find the parent object of a given element using an identifying dataset index.
 *
 * @param {HTMLElement} elem - The child element.
 * @param {string} [key=module] - The data attribute to check for parentage.
 * @returns {HTMLElement} The parent element, or the element itself if no modules are found.
 */
export default function findParent(
  elem: HTMLElement,
  key = "module"
): HTMLElement {
  if (elem.parentElement) {
    if (elem.parentElement.dataset[key]) {
      return elem.parentElement;
    }

    return findParent(elem.parentElement);
  }

  return elem;
}
