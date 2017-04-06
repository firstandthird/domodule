function findParent(elem) {
  if (elem.parentNode) {
    // Accounting for https://bugs.webkit.org/show_bug.cgi?id=161454
    const dataset = JSON.parse(JSON.stringify(elem.parentNode.dataset));

    if (dataset.module) {
      return elem.parentNode;
    }

    return findParent(elem.parentNode);
  }

  return elem;
}

export default findParent;
