'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Domodule = function () {
  function Domodule(el) {
    var _this = this;

    _classCallCheck(this, Domodule);

    this.el = el;
    this.els = {};
    this.options = this.serializeAttrs('module', this.el);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var action = _step.value;

        action.addEventListener(action.dataset.actionType || 'click', function (event) {
          _this[action.dataset.action].call(_this, action, event, _this.serializeAttrs('action', action));
        });
      };

      for (var _iterator = this.find('[data-action]')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
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

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.find('[data-name]')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var named = _step2.value;

        this.els[named.dataset.name] = named;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return this;
  }

  _createClass(Domodule, [{
    key: 'serializeAttrs',
    value: function serializeAttrs(key, el) {
      var values = {};

      for (var data in el.dataset) {
        if (el.dataset.hasOwnProperty(data) && data.startsWith(key) && data !== key) {
          var optionName = data.replace(key, '');
          optionName = optionName[0].toLowerCase() + optionName.slice(1);
          values[optionName] = el.dataset[data];
        }
      }

      return values;
    }
  }, {
    key: 'find',
    value: function find(selector) {
      return this.el.querySelectorAll(selector);
    }
  }]);

  return Domodule;
}();