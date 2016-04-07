'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var foundModules = document.querySelectorAll('[data-module]');

  window.domoduleref = {};

  var idx = 0;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = foundModules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var module = _step.value;

      var moduleName = module.dataset.module;

      if (moduleName && typeof window[moduleName] === 'function') {
        window.domoduleref[idx] = new window[moduleName](module);
        module.dataset.domodule = idx;
        idx++;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}, false);