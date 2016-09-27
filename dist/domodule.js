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
      var _this2 = this;

      this.setupAction(this.el);

      Array.from(this.find('[data-action]')).forEach(function (action) {
        _this2.setupAction(action);
      });
    }
  }, {
    key: 'setupAction',
    value: function setupAction(action) {
      var _this3 = this;

      if (action.dataset.domoduleActionProcessed) {
        return;
      }

      action.addEventListener(action.dataset.actionType || 'click', function (event) {
        if (typeof _this3[action.dataset.action] !== 'function') {
          return;
        }

        _this3[action.dataset.action].call(_this3, action, event, _this3.serializeAttrs('action', action));
      });

      action.dataset.domoduleActionProcessed = true;
    }
  }, {
    key: 'setupNamed',
    value: function setupNamed() {
      var _this4 = this;

      Array.from(this.find('[data-name]')).forEach(function (named) {
        if (!named.dataset.domoduleNameProcessed) {
          _this4.els[named.dataset.name] = named;
          named.dataset.domoduleNameProcessed = true;
        }
      });
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

      this.el.dataset.moduleUid = Domodule.refs.length;
      Domodule.refs.push(this);
    }
  }, {
    key: 'serializeAttrs',
    value: function serializeAttrs(key, el) {
      var values = {};

      Array.from(Object.keys(el.dataset)).forEach(function (data) {
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
      });

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

      Array.from(els).forEach(function (matched) {
        var foundModules = Array.from(matched.querySelectorAll('[data-module]'));

        foundModules.forEach(function (moduleEl) {
          var moduleName = moduleEl.dataset.module;

          if (moduleName && typeof Domodule.modules[moduleName] === 'function') {
            if (_typeof(Domodule.refs) === 'object' && typeof Domodule.refs[moduleEl.dataset.moduleUid] !== 'undefined') {
              return;
            } else {
              new Domodule.modules[moduleName](moduleEl);
            }
          }
        });
      });
    }
  }]);

  return Domodule;
}();

exports.default = Domodule;