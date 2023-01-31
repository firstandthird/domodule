/**
 * Find the parent object of a given element using an identifying dataset index.
 *
 * @param elem - The child element.
 * @param key - The data attribute to check for parentage.
 * @returns The parent element, or the element itself if no modules are found.
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
