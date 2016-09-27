/* eslint no-new:0 */

export default class Domodule { // eslint-disable-line no-unused-vars
  constructor(el, requiredOptions = []) {
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

  verifyOptions() {
    if (!Array.isArray(this.requiredOptions)) {
      return this;
    }

    this.requiredOptions.forEach((option) => {
      if (!this.options.hasOwnProperty(option)) {
        throw new Error(`Missing required option: ${option}`);
      }
    });

    return this;
  }

  setupActions() {
    this.setupAction(this.el);

    Array.from(this.find('[data-action]')).forEach(action => {
      this.setupAction(action);
    });
  }

  setupAction(action) {
    if (action.dataset.domoduleActionProcessed) {
      return;
    }

    action.addEventListener(
      action.dataset.actionType || 'click',
      event => {
        if (typeof this[action.dataset.action] !== 'function') {
          return;
        }

        this[action.dataset.action].call(
          this,
          action,
          event,
          this.serializeAttrs('action', action)
        );
      }
    );

    action.dataset.domoduleActionProcessed = true;
  }

  setupNamed() {
    Array.from(this.find('[data-name]')).forEach(named => {
      if (!named.dataset.domoduleNameProcessed) {
        this.els[named.dataset.name] = named;
        named.dataset.domoduleNameProcessed = true;
      }
    });
  }

  storeRef() {
    if (typeof Domodule.refs === 'undefined') {
      Domodule.refs = [];
    }

    if (typeof Domodule.refs[this.el.dataset.moduleUid] !== 'undefined') {
      return false;
    }

    this.el.dataset.moduleUid = Domodule.refs.length;
    Domodule.refs.push(this);
  }

  serializeAttrs(key, el) {
    const values = {};

    Array.from(Object.keys(el.dataset)).forEach(data => {
      if (data.startsWith(key) && data !== key) {
        let optionName = data.replace(key, '');
        let isGlobal = false;

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

  find(selector) {
    return this.el.querySelectorAll(selector);
  }

  findOne(selector) {
    const found = this.find(selector);

    if (found.length) {
      return found[0];
    }

    return null;
  }

  findByName(name) {
    return this.els[name];
  }

  getOption(option) {
    return this.options[option];
  }

  // static methods can't access `this` so they go last
  static getInstance(element) {
    if (element instanceof Node) {
      return Domodule.refs[element.dataset.moduleUid];
    }

    throw new Error('getInstance expects a dom node');
  }

  static register(name, cls) {
    if (!Domodule.modules) {
      Domodule.modules = {};
    }
    Domodule.modules[name] = cls;
  }

  static discover(el = 'body') {
    let els;

    if (el instanceof Node) {
      els = [el];
    } else if (Array.isArray(el)) {
      els = el;
    } else {
      els = document.querySelectorAll(el);
    }

    Array.from(els).forEach(matched => {
      const foundModules = Array.from(matched.querySelectorAll('[data-module]'));

      foundModules.forEach(moduleEl => {
        const moduleName = moduleEl.dataset.module;

        if (moduleName && typeof Domodule.modules[moduleName] === 'function') {
          if (typeof Domodule.refs === 'object' && typeof Domodule.refs[moduleEl.dataset.moduleUid] !== 'undefined') {
            return;
          } else {
            new Domodule.modules[moduleName](moduleEl);
          }
        }
      });
    });
  }
}
