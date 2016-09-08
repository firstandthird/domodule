'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint no-new:0 */

var Domodule = function () {
  // eslint-disable-line no-unused-vars
  function Domodule(el) {
    var requiredOptions = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    _classCallCheck(this, Domodule);

    this.el = el;
    this.els = {};
    this.options = this.serializeAttrs('module', this.el);
    this.requiredOptions = requiredOptions;

    this.verifyOptions();
    this.setupActions();
    this.setupNamed();
    this.storeRef();

    return this;
  }

  _createClass(Domodule, [{
    key: 'verifyOptions',
    value: function verifyOptions() {
      var _this = this;

      if (!Array.isArray(this.requiredOptions)) {
        return this;
      }

      this.requiredOptions.forEach(function (option) {
        if (!_this.options.hasOwnProperty(option)) {
          throw new Error('Missing required option: ' + option);
        }
      });

      return this;
    }
  }, {
    key: 'setupActions',
    value: function setupActions() {
      this.setupAction(this.el);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.find('[data-action]')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var action = _step.value;

          this.setupAction(action);
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
    }
  }, {
    key: 'setupAction',
    value: function setupAction(action) {
      var _this2 = this;

      if (action.dataset.domoduleActionProcessed) {
        return;
      }

      action.addEventListener(action.dataset.actionType || 'click', function (event) {
        if (typeof _this2[action.dataset.action] !== 'function') {
          return;
        }

        _this2[action.dataset.action].call(_this2, action, event, _this2.serializeAttrs('action', action));
      });

      action.dataset.domoduleActionProcessed = true;
    }
  }, {
    key: 'setupNamed',
    value: function setupNamed() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.find('[data-name]')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var named = _step2.value;

          if (!named.dataset.domoduleNameProcessed) {
            this.els[named.dataset.name] = named;
            named.dataset.domoduleNameProcessed = true;
          }
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
    }
  }, {
    key: 'storeRef',
    value: function storeRef() {
      if (typeof Domodule.refs === 'undefined') {
        Domodule.refs = [];
      }

      if (typeof Domodule.refs[this.el.dataset.moduleUid] !== 'undefined') {
        return false;
      }

      var id = Domodule.refs.length;
      this.el.dataset.moduleUid = id;
      Domodule.refs.push(this);
    }
  }, {
    key: 'serializeAttrs',
    value: function serializeAttrs(key, el) {
      var values = {};

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.keys(el.dataset)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var data = _step3.value;

          if (data.startsWith(key) && data !== key) {
            var optionName = data.replace(key, '');
            var isGlobal = false;

            if (optionName.startsWith('Global')) {
              optionName = optionName.replace('Global', '');
              isGlobal = true;
            }

            optionName = optionName[0].toLowerCase() + optionName.slice(1);

            if (isGlobal) {
              values[optionName] = window[el.dataset[data]];
            } else {
              values[optionName] = el.dataset[data];
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return values;
    }
  }, {
    key: 'find',
    value: function find(selector) {
      return this.el.querySelectorAll(selector);
    }
  }, {
    key: 'findOne',
    value: function findOne(selector) {
      var found = this.find(selector);

      if (found.length) {
        return found[0];
      }

      return null;
    }
  }, {
    key: 'findByName',
    value: function findByName(name) {
      return this.els[name];
    }
  }, {
    key: 'getOption',
    value: function getOption(option) {
      return this.options[option];
    }

    // static methods can't access `this` so they go last

  }], [{
    key: 'getInstance',
    value: function getInstance(element) {
      if (element instanceof Node) {
        return Domodule.refs[element.dataset.moduleUid];
      }

      throw new Error('getInstance expects a dom node');
    }
  }, {
    key: 'register',
    value: function register(name, cls) {
      if (!Domodule.modules) {
        Domodule.modules = {};
      }
      Domodule.modules[name] = cls;
    }
  }, {
    key: 'discover',
    value: function discover() {
      var el = arguments.length <= 0 || arguments[0] === undefined ? 'body' : arguments[0];

      var els = void 0;

      if (el instanceof Node) {
        els = [el];
      } else if (Array.isArray(el)) {
        els = el;
      } else {
        els = document.querySelectorAll(el);
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = els[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var matched = _step4.value;

          var foundModules = matched.querySelectorAll('[data-module]');

          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = foundModules[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var moduleEl = _step5.value;

              var moduleName = moduleEl.dataset.module;

              if (moduleName && typeof Domodule.modules[moduleName] === 'function') {
                if (_typeof(Domodule.refs) === 'object' && typeof Domodule.refs[moduleEl.dataset.moduleUid] !== 'undefined') {
                  continue;
                } else {
                  new Domodule.modules[moduleName](moduleEl);
                }
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  }]);

  return Domodule;
}();

exports.default = Domodule;