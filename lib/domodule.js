/* eslint no-new:0 */

import parentModule from '../lib/getParentModule';
import attrObj from 'attrobj';
import aug from 'aug';
import { find, findOne, on } from 'domassist';

const ACTION_SELECTOR = '[data-action]';
const DOMAssist = { find, findOne, on };

class Domodule {
  constructor(el) {
    this.log('begin setup');
    this.el = el;
    this.els = {};
    this.options = aug({}, this.defaults, attrObj('module', this.el));
    this.moduleName = this.el.dataset.module;
    this.setUps = {
      actions: [],
      named: [],
      options: []
    };
    this.boundActionRouter = this.actionRouter.bind(this);

    this.preInit();
    this.storeRef();
    this.setupActions();
    this.setupNamed();
    this.verifyRequired();
    this.postInit();
    this.log('initalized');

    return this;
  }

  preInit() {
  }

  postInit() {
  }

  get required() {
    return {};
  }

  get defaults() {
    return {};
  }

  verifyRequired() {
    if (this.required === {}) {
      return this;
    }

    if (typeof this.required.options !== 'undefined') {
      this.setUps.options = Object.keys(this.options);
    }

    Object.keys(this.required).forEach((required) => {
      this.required[required].forEach((value) => {
        if (this.setUps[required].indexOf(value) < 0) {
          throw new Error(`${value} is required as ${required} for ${this.moduleName}, but is missing!`);
        }
      });
    });

    return this;
  }

  setupActions() {
    this.setupAction(this.el);

    this.find(ACTION_SELECTOR).forEach((action) => {
      if (~~parentModule(action).dataset.moduleUid === this.id) {
        this.setupAction(action);
      }
    });
  }

  setupAction(actionEl) {
    if (actionEl.dataset.domoduleActionProcessed) {
      return;
    }

    const { name: actionName, type: actionType } = Domodule.parseAction(actionEl);

    if (!actionName) {
      return;
    } else if (typeof this[actionName] !== 'function') {
      this.log(`${actionName} was registered, but there is no function set up`);
      return;
    }

    this.log(`${actionName} bound`);
    this.storeSetUp(actionName, 'actions');

    DOMAssist.on(actionEl, actionType, this.boundActionRouter);

    actionEl.dataset.domoduleActionProcessed = true;
  }

  actionRouter(event) {
    const actionEl = event.target;
    const { name: actionName } = Domodule.parseAction(actionEl);
    const actionData = attrObj('action', actionEl);

    this[actionName].call(
      this,
      actionEl,
      event,
      actionData
    );
  }

  setupNamed() {
    this.find('[data-name]').forEach((named) => {
      if (~~parentModule(named).dataset.moduleUid !== this.id) {
        return;
      }

      if (!named.dataset.domoduleNameProcessed) {
        this.els[named.dataset.name] = named;

        this.storeSetUp(named.dataset.name, 'named');
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

  find(selector) {
    return DOMAssist.find(selector, this.el);
  }

  findOne(selector) {
    return DOMAssist.findOne(selector, this.el);
  }

  findByName(name) {
    return this.els[name];
  }

  getOption(option) {
    return this.options[option];
  }

  storeSetUp(name, dict) {
    if (this.setUps[dict].indexOf(name) < 0) {
      this.setUps[dict].push(name);
    }
  }

  destroy() {
    DOMAssist.find(ACTION_SELECTOR, this.el.parentNode).forEach(el => {
      if (el.dataset.domoduleActionProcessed) {
        const { type: actionType } = Domodule.parseAction(el);

        el.removeEventListener(actionType, this.boundActionRouter);
        el.dataset.domoduleActionProcessed = false;
      }
    });
  }

  // static methods can't access `this` so they go last
  static parseAction(el) {
    const { action: name, actionType: type = 'click' } = el.dataset;
    return { name, type };
  }

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
      els = DOMAssist.find(el);
    }

    const instances = [];
    els.forEach((matched) => {
      const foundModules = DOMAssist.find('[data-module]', matched);

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
Domodule.debug = (typeof window.localStorage === 'object' && window.localStorage.getItem('DomoduleDebug'));

Domodule.autoDiscover = true;
window.addEventListener('DOMContentLoaded', () => {
  if (Domodule.autoDiscover) {
    Domodule.discover();
  }
});

export default Domodule;
