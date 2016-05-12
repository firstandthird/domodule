/* eslint no-new:0 */

class Domodule { // eslint-disable-line no-unused-vars
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

    for (const requiredOption of Array.values(this.requiredOptions)) {
      if (!this.options.hasOwnProperty(requiredOption)) {
        throw new Error(`Missing required option: ${requiredOption}`);
      }
    }

    return this;
  }

  setupActions() {
    for (const action of this.find('[data-action]')) {
      if (action.dataset.domoduleActionProcessed) {
        continue;
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
  }

  setupNamed() {
    for (const named of this.find('[data-name]')) {
      if (!named.dataset.domoduleNameProcessed) {
        this.els[named.dataset.name] = named;
        named.dataset.domoduleNameProcessed = true;
      }
    }
  }

  storeRef() {
    if (typeof Domodule.refs === 'undefined') {
      Domodule.refs = {};
    }

    if (!this.el.id) {
      throw new Error('Module container should have a unique id attribute');
    }

    if (typeof Domodule.refs[this.el.id] !== 'undefined') {
      return false;
    }

    Domodule.refs[this.el.id] = this;
  }

  serializeAttrs(key, el) {
    const values = {};

    for (const data of Object.keys(el.dataset)) {
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
    }

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
  static getInstance(name) {
    return Domodule.refs[name];
  }

  static discover(el = 'body') {
    let els;

    if (el instanceof Node) {
      els = [el];
    } if (Array.isArray(el)) {
      els = el;
    } else {
      els = document.querySelectorAll(el);
    }

    for (const matched of els) {
      const foundModules = matched.querySelectorAll('[data-module]');

      for (const moduleEl of foundModules) {
        const moduleName = moduleEl.dataset.module;

        if (moduleName && typeof window[moduleName] === 'function') {
          if (typeof Domodule.refs === 'object' && typeof Domodule.refs[moduleEl.id] !== 'undefined') {
            continue;
          } else {
            new window[moduleName](moduleEl);
          }
        }
      }
    }
  }
}
