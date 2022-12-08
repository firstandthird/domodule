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
