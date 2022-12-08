import { find, findOne, on } from "domassist";
import attrObj, { type AttrObj } from "attrobj";
import parentModule from "../lib/getParentModule";

export type SettingIndex = "actions" | "named" | "options";

export interface Settings {
  actions?: string[];
  named?: string[];
  options?: string[];
}

const ACTION_SELECTOR = "[data-action]";
const DOMAssist = { find, findOne, on };

class Domodule {
  readonly el: HTMLElement;
  readonly options: AttrObj;
  readonly moduleName: string;
  els: { [index: string]: HTMLElement };
  defaults: Settings;
  required: Settings;
  setUps: Settings;
  id: string;

  constructor(el: HTMLElement, name?: string) {
    this.log("Beginning setup");
    this.el = el;
    this.els = {};
    this.id = "";
    this.options = { ...this.defaults, ...attrObj("module", this.el) };
    this.moduleName = name || this.el.dataset.module || "";
    this.setUps = {
      actions: [],
      named: [],
      options: [],
    };
    this.boundActionRouter = this.actionRouter.bind(this);

    this.preInit();
    this.storeRef();
    this.setupActions();
    this.setupNamed();
    this.verifyRequired();
    this.postInit();
    this.log("Initalized");

    if (Domodule.debug) {
      this.el.module = this;
    }

    return this;
  }

  preInit() {
    this.log("No preInit() action included.");
  }

  postInit() {
    this.log("No postInit() action included.");
  }

  get required() {
    return {};
  }

  get defaults() {
    return {};
  }

  get uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  verifyRequired() {
    if (this.required === {}) {
      return this;
    }

    if (typeof this.required.options !== "undefined") {
      this.setUps.options = Object.keys(this.options);
    }

    Object.keys(this.required).forEach((setting: SettingIndex) => {
      this.required[setting].forEach((value: string) => {
        if (this.setUps[setting].indexOf(value) < 0) {
          throw new Error(
            `${value} is required as ${setting} for ${this.moduleName}, but is missing!`
          );
        }
      });
    });

    return this;
  }

  setupActions() {
    this.setupAction(this.el);

    this.find(ACTION_SELECTOR).forEach((action) => {
      const parent = parentModule(action);

      if (parent === this.el) {
        this.setupAction(action);
      }
    });
  }

  setupAction(actionEl: HTMLElement) {
    if (actionEl.dataset.domoduleActionProcessed === "true") {
      return;
    }

    const { name: actionName, type: actionType } =
      Domodule.parseAction(actionEl);

    if (!actionName) {
      return;
    } else if (typeof this[actionName] !== "function") {
      this.log(`${actionName} was registered, but there is no function set up`);
      return;
    }

    this.log(`${actionName} bound`);
    this.storeSetUp(actionName, "actions");

    DOMAssist.on(actionEl, actionType, this.boundActionRouter);

    actionEl.dataset.domoduleActionProcessed = "true";
  }

  actionRouter(event: Event) {
    const actionEl = event.currentTarget;
    const { name: actionName } = Domodule.parseAction(actionEl);
    const actionData = attrObj("action", actionEl);

    this[actionName].call(this, actionEl, event, actionData);
  }

  setupNamed() {
    this.find("[data-name]").forEach((named) => {
      const parent = parentModule(named);

      if (parent !== this.el) {
        return;
      }

      if (!named.dataset.domoduleNameProcessed) {
        this.els[named.dataset.name] = named;

        this.storeSetUp(named.dataset.name, "named");
        named.dataset.domoduleNameProcessed = "true";
        named.dataset.domoduleOwner = this.id;
      }
    });
  }

  storeRef() {
    if (typeof window.domorefs === "undefined") {
      window.domorefs = {};
    }

    if (typeof window.domorefs[this.el.dataset.moduleUid] !== "undefined") {
      return false;
    }

    this.id = this.uuid;
    this.el.dataset.moduleUid = this.id;
    window.domorefs[this.el.dataset.moduleUid] = this;
  }

  find(selector: string | HTMLElement | NodeList) {
    return DOMAssist.find(selector, this.el);
  }

  findOne(selector: string) {
    return DOMAssist.findOne(selector, this.el);
  }

  findByName(name: string) {
    return this.els[name];
  }

  getOption(option: string) {
    return this.options[option];
  }

  storeSetUp(name: string, dict: SettingIndex) {
    if (this.setUps[dict].indexOf(name) < 0) {
      this.setUps[dict].push(name);
    }
  }

  destroy() {
    DOMAssist.find(ACTION_SELECTOR, this.el.parentNode).forEach((el) => {
      if (el.dataset.domoduleActionProcessed === "true") {
        const { type: actionType } = Domodule.parseAction(el);

        el.removeEventListener(actionType, this.boundActionRouter);
        el.dataset.domoduleActionProcessed = "false";
      }
    });
  }

  protected log(msg: string) {
    Domodule.log(`${this.constructor.name}: ${msg}`);
  }

  protected error(msg: string) {
    Domodule.error(`${this.constructor.name}: ${msg}`);
  }

  // static methods can't access `this` so they go last
  static parseAction(el: HTMLElement) {
    return {
      name: el.dataset.action,
      type: el.dataset.actionType ?? "click",
    };
  }

  static getInstance(element: HTMLElement) {
    if (element.dataset.moduleUid) {
      return window.domorefs[element.dataset.moduleUid];
    }

    Domodule.log(`The dataset of ${element.nodeName} has no UID.`);
    return false;
  }

  static register(name: string | typeof this, cls?: typeof this) {
    if (typeof name === "function") {
      cls = name;
      name = cls.prototype.constructor.name;
    }

    if (!window.domodules) {
      window.domodules = {};
    }

    Domodule.log(`Registering ${name}`);
    window.domodules[name] = cls;
  }

  static discover(
    el: string | HTMLElement[] | HTMLElement = "body"
  ): Array<typeof this> {
    Domodule.log("Discovering modules...");

    if (!window.domodules) {
      Domodule.log("No modules found");
      return;
    }

    let els;

    if (el instanceof Element) {
      els = [el];
    } else if (Array.isArray(el)) {
      els = el;
    } else {
      els = DOMAssist.find(el);
    }

    const instances: Domodule[] = [];

    els.forEach((matched) => {
      const foundModules = DOMAssist.find("[data-module]", matched);

      foundModules.forEach((moduleEl) => {
        const moduleName = moduleEl.dataset.module;

        if (moduleName && typeof window.domodules[moduleName] === "function") {
          if (
            typeof window.domorefs === "object" &&
            typeof window.domorefs[moduleEl.dataset.moduleUid] !== "undefined"
          ) {
            return;
          }

          Domodule.log(`${moduleName} found`);
          instances.push(new window.domodules[moduleName](moduleEl));
        }
      });
    });

    return instances;
  }

  static log(msg: string) {
    if (Domodule.debug) {
      console.log(`[DOMODULE] ${msg}`); //eslint-disable-line no-console
    }
  }

  static error(msg: string) {
    if (Domodule.debug) {
      console.error(`[DOMODULE] ${msg}`); //eslint-disable-line no-console
    }
  }
}

Domodule.debug =
  typeof window.localStorage === "object" &&
  window.localStorage.getItem("DomoduleDebug");

Domodule.autoDiscover = true;
window.addEventListener("DOMContentLoaded", () => {
  if (Domodule.autoDiscover) {
    Domodule.discover();
  }
});

declare global {
  interface Window {
    domorefs?: { [index: string]: HTMLElement };
    domodules?: { [index: string]: Domodule };
  }
}

export default Domodule;
