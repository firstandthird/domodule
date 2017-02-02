/* eslint no-new:0 */

import parentModule from '../lib/getParentModule';
import attrObj from 'attrobj';
import * as domassist from 'domassist';

class Domodule {
  constructor(el, requiredOptions = []) {
    this.log('begin setup');
    this.el = el;
    this.els = {};
    this.options = attrObj('module', this.el);
    this.requiredOptions = requiredOptions;
    this.moduleName = this.el.dataset.module;

    this.preInit();
    this.verifyOptions();
    this.storeRef();
    this.setupActions();
    this.setupNamed();
    this.postInit();
    this.log('initalized');

    return this;
  }

  preInit() {
  }

  postInit() {
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

    this.find('[data-action]', true).forEach((action) => {
      if (~~parentModule(action).dataset.moduleUid === this.id) {
        this.setupAction(action);
      }
    });
  }

  setupAction(element) {
    if (element.dataset.domoduleActionProcessed) {
      return;
    }

    this.log(`${element.dataset.action} bound`);
    const action = element.dataset.action;
    const eventType = element.dataset.actionType || 'click';

    domassist.on(element, eventType, event => {
      if (typeof this[element.dataset.action] !== 'function') {
        return;
      }

      this[element.dataset.action].call(
        this,
        element,
        event,
        attrObj('action', element)
      );
    });

    element.dataset.domoduleActionProcessed = true;
  }

  setupNamed() {
    this.find('[data-name]', true).forEach((named) => {
      if (~~parentModule(named).dataset.moduleUid !== this.id) {
        return;
      }

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

    this.id = Domodule.refs.length;
    this.el.dataset.moduleUid = this.id;
    Domodule.refs.push(this);
  }

  find(selector, convertToArray) {
    let nodeList = domassist.find(selector, this.el);

    if (convertToArray) {
      nodeList = domassist.toArray(nodeList);
    }

    return nodeList;
  }

  findOne(selector) {
    return domassist.findOne(selector, this.el);
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
    if (typeof name === 'function') {
      cls = name;
      name = cls.prototype.constructor.name;
    }
    if (!Domodule.modules) {
      Domodule.modules = {};
    }
    Domodule.log(`Registering ${name}`);
    Domodule.modules[name] = cls;
  }

  static discover(el = 'body') {
    Domodule.log('Discovering modules...');
    if (!Domodule.modules) {
      Domodule.log('No modules found');
      return;
    }
    let els;

    if (el instanceof Node) {
      els = [el];
    } else if (Array.isArray(el)) {
      els = el;
    } else {
      els = domassist.toArray(domassist.find(el, document));
    }

    const instances = [];
    els.forEach((matched) => {
      const foundModules = domassist.toArray(domassist.find('[data-module]', matched));

      foundModules.forEach((moduleEl) => {
        const moduleName = moduleEl.dataset.module;

        if (moduleName && typeof Domodule.modules[moduleName] === 'function') {
          if (typeof Domodule.refs === 'object' && typeof Domodule.refs[moduleEl.dataset.moduleUid] !== 'undefined') {
            return;
          }
          Domodule.log(`${moduleName} found`);
          instances.push(new Domodule.modules[moduleName](moduleEl));
        }
      });
    });
    return instances;
  }

  //used inside instance
  log(msg) {
    Domodule.log(`${this.constructor.name}: ${msg}`);
  }

  static log(msg) {
    if (Domodule.debug) {
      console.log(`[DOMODULE] ${msg}`); //eslint-disable-line no-console
    }
  }
}
Domodule.debug = false;

Domodule.autoDiscover = true;
window.addEventListener('DOMContentLoaded', () => {
  if (Domodule.autoDiscover) {
    Domodule.discover();
  }
});

export default Domodule;
