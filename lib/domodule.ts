import { find, findOne, on } from "domassist";
import attrObj, { type AttrObj } from "attrobj";
import parentModule from "./getParentModule";

export type DomoduleAction = (
  actionEl: EventTarget | null,
  event: Event,
  actionData: AttrObj
) => any;
export type DomoduleSettings = {
  [index: string]: string[];
};

const ACTION_SELECTOR = "[data-action]";
const DOMAssist = { find, findOne, on };

export default class Domodule {
  readonly el: HTMLElement;
  readonly options: AttrObj;
  readonly moduleName: string;

  els: { [index: string]: HTMLElement };
  setUps: DomoduleSettings;
  id: string;

  [index: string]: any;

  constructor(el: HTMLElement, name?: string) {
    this.log("Beginning setup");
    this.el = el;
    this.options = { ...this.defaults, ...attrObj("module", this.el) };
    this.moduleName = name || this.el.dataset.module || "";
    this.els = {};
    this.setUps = {};
    this.id = "";

    this.preInit();
    this.generateUuid();
    this.storeRef();
    this.setupActions();
    this.setupNamed();
    this.verifyRequired();
    this.postInit();
    this.log("Initalized");

    window.addEventListener("DOMContentLoaded", () => {
      Domodule.discover();
    });

    return this;
  }

  get required(): DomoduleSettings {
    return {};
  }

  get defaults(): AttrObj {
    return {};
  }

  preInit() {
    this.log("No preInit() actions included.");
  }

  postInit() {
    this.log("No postInit() actions included.");
  }

  protected generateUuid() {
    this.id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  storeRef() {
    if (typeof window.domorefs === "undefined") {
      window.domorefs = {};
    }

    if (!!window.domorefs[this.el.dataset.moduleUid || "undefined"]) {
      return false;
    }

    this.el.dataset.moduleUid = this.id;
    window.domorefs[this.el.dataset.moduleUid] = this;
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

    DOMAssist.on(actionEl, actionType, this.actionRouter);

    actionEl.dataset.domoduleActionProcessed = "true";
  }

  actionRouter = (event: Event) => {
    const actionEl = event.currentTarget;
    const { name: actionName } = Domodule.parseAction(actionEl as HTMLElement);
    const actionData = attrObj("action", actionEl as HTMLElement);

    if (actionName)
      (this[actionName] as DomoduleAction).call(
        this,
        actionEl,
        event,
        actionData
      );
  };

  setupNamed() {
    this.find("[data-name]").forEach((named) => {
      if (!named.dataset.name) return;
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

  storeSetUp(name: string, dict: string) {
    if (this.setUps[dict] === undefined) {
      this.setUps[dict] = [];
    }

    if (this.setUps[dict].indexOf(name) < 0) {
      this.setUps[dict].push(name);
    }
  }

  verifyRequired() {
    if (this.required?.options?.length) {
      this.setUps.options = Object.keys(this.options);
    }

    Object.keys(this.required).forEach((setting) => {
      this.required[setting].forEach((value) => {
        if (this.setUps[setting].indexOf(value) < 0) {
          throw new Error(
            `${value} is required as ${setting} for ${this.moduleName}, but is missing!`
          );
        }
      });
    });

    return this;
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

  destroy() {
    DOMAssist.find(ACTION_SELECTOR, this.el.parentElement ?? undefined).forEach(
      (el) => {
        if (el.dataset.domoduleActionProcessed === "true") {
          const { type: actionType } = Domodule.parseAction(el);

          el.removeEventListener(actionType, this.actionRouter);
          el.dataset.domoduleActionProcessed = "false";
        }
      }
    );
  }

  protected log(msg: string) {
    Domodule.log(`${this.constructor.name}: ${msg}`);
  }

  protected error(msg: string) {
    Domodule.error(`${this.constructor.name}: ${msg}`);
  }

  //* static methods can't access `this` so they go last
  static parseAction(el: HTMLElement) {
    return {
      name: el.dataset.action,
      type: el.dataset.actionType ?? "click",
    };
  }

  static getInstance(element: HTMLElement) {
    if (element.dataset.moduleUid && window.domorefs)
      return window.domorefs[element.dataset.moduleUid];

    Domodule.log(
      `The dataset of ${element.getAttribute("id") || "NO ID"} has no UID.`
    );
    return false;
  }

  static register(name: string | typeof Domodule, cls?: typeof Domodule) {
    if (typeof name !== "string") {
      cls = name;
      name = cls.prototype.constructor.name;
    }

    if (!window.domodules) {
      window.domodules = {};
    }

    Domodule.log(`Registering ${name}`);
    window.domodules[name] = cls as unknown as Domodule;
  }

  static discover(
    el: string | HTMLElement[] | HTMLElement = "body"
  ): Domodule[] | undefined {
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

        if (
          moduleName &&
          window.domodules &&
          typeof window.domodules[moduleName] === "function"
        ) {
          if (
            typeof window.domorefs === "object" &&
            moduleEl.dataset.moduleUid &&
            typeof window.domorefs[moduleEl.dataset.moduleUid] !== "undefined"
          ) {
            return;
          }

          Domodule.log(`${moduleName} found`);
          const Module: typeof Domodule = window.domodules[
            moduleName
          ] as unknown as typeof Domodule;
          instances.push(new Module(moduleEl));
        }
      });
    });

    return instances;
  }

  static log(msg: string) {
    console.log(`[DOMODULE] ${msg}`); //eslint-disable-line no-console
  }

  static error(msg: string) {
    console.error(`[DOMODULE] ${msg}`); //eslint-disable-line no-console
  }
}

declare global {
  interface Window {
    domorefs?: { [index: string]: Domodule };
    domodules?: { [index: string]: Domodule };
  }
}
