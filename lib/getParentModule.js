function findParent(elem) {
  if (elem.parentNode) {
    if (elem.parentNode.dataset.module) {
      return elem.parentNode;
    }

    return findParent(elem.parentNode);
  }

  return elem;
}

export default findParent;
