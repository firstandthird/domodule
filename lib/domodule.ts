/**
 * Class-based JavaScript modules.
 *
 * @module Domodule
 */

import { find, findOne, on } from "domassist";
import attrObj, { type AttrObj } from "attrobj";
import parentModule from "./getParentModule";

/** Defines any action listener callback on Domodule. */
export type DomoduleAction = (
  actionEl: EventTarget | null,
  event: Event,
  actionData: AttrObj
) => any;

/** A catch-all type for Domodule setting blocks. */
export type DomoduleSettings = {
  [index: string]: string[];
};

const ACTION_SELECTOR = "[data-action]";
const DOMAssist = { find, findOne, on };

export default class Domodule {
  readonly el: HTMLElement;
  readonly options: AttrObj;
  readonly moduleName: string;

  protected setUps: DomoduleSettings;

  private id: string;

  els: { [index: string]: HTMLElement };

  [index: string]: any;

  /**
   * Creates a Domodule instance.
   *
   * @class
   * @param {HTMLElement} el - The element referenced by the module.
   * @param {string} name - The name of the module, as referenced in code.
   * @returns {Domodule} An instance of the Domodule class.
   */
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

  /** Defines actions taken before DOM instances are created. */
  protected preInit() {
    this.log("No preInit() actions included.");
  }

  /** Defines actions taken after DOM instances are created. */
  protected postInit() {
    this.log("No postInit() actions included.");
  }

  /** Generates a unique ID for every new instance. */
  protected generateUuid() {
    this.id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Adds a discovered instance as a reference to the global window object.
   *
   * @returns {boolean|void} False if module UID exists, otherwise void.
   */
  private storeRef() {
    if (typeof window.domorefs === "undefined") {
      window.domorefs = {};
    }

    if (!!window.domorefs[this.el.dataset.moduleUid || "undefined"]) {
      return false;
    }

    this.el.dataset.moduleUid = this.id;
    window.domorefs[this.el.dataset.moduleUid] = this;
  }

  /** Finds all DOM elements with data-action defs and initializes them. */
  private setupActions() {
    this.setupAction(this.el);

    this.find(ACTION_SELECTOR).forEach((action) => {
      const parent = parentModule(action);

      if (parent === this.el) {
        this.setupAction(action);
      }
    });
  }

  /**
   * Creates a module action listener for the given element.
   *
   * @param {HTMLElement} actionEl - The element that triggers the JS event.
   */
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

  /**
   * Catches registered event triggers and calls the action's function.
   *
   * @param {Event} event - The triggered event object.
   */
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

  /** Adds all named children of a module as references. */
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

  /**
   * Stores module options and references on the instance.
   *
   * @param {string} name - The name of the option or reference.
   * @param {string} dict - The optionset index.
   */
  storeSetUp(name: string, dict: string) {
    if (this.setUps[dict] === undefined) {
      this.setUps[dict] = [];
    }

    if (this.setUps[dict].indexOf(name) < 0) {
      this.setUps[dict].push(name);
    }
  }

  /**
   * Validates module settings and throws an error if settings are missing.
   *
   * @returns {Domodule} The instanced object.
   */
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

  /**
   * Finds and returns an array of matching elements.
   *
   * @param {string|HTMLElement|NodeList} selector - The value to search.
   * @returns {Array<HTMLElement>} The array of elements matching the selector.
   */
  find(selector: string | HTMLElement | NodeList) {
    return DOMAssist.find(selector, this.el);
  }

  /**
   * Returns the first instance of the DOM matching a CSS selector.
   *
   * @param {string} selector - The identifier to search.
   * @returns {HTMLElement|null} The first matching element, or null.
   */
  findOne(selector: string) {
    return DOMAssist.findOne(selector, this.el);
  }

  /**
   * Returns the DOM element with the matching data-name attribute.
   *
   * @param {string} name - The data value of the element.
   * @returns {HTMLElement|undefined} The matching element, or undefined.
   */
  findByName(name: string): HTMLElement | undefined {
    return this.els[name];
  }

  /**
   * Returns the value of a single option in the module.
   *
   * @param {string} option - The option's index.
   * @returns {string} The option's value.
   */
  getOption(option: string) {
    return this.options[option];
  }

  /** Unbinds all action listeners from a module instance. */
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

  /**
   * Logs a message to the Javascript console.
   *
   * @param {string} msg - The message to print.
   */
  protected log(msg: string) {
    Domodule.log(`${this.constructor.name}: ${msg}`);
  }

  /**
   * Logs an error to the Javascript console.
   *
   * @param {string} msg - The error to print.
   */
  protected error(msg: string) {
    Domodule.error(`${this.constructor.name}: ${msg}`);
  }

  /**
   * Gets the action callback and event type arguments from a DOM element.
   *
   * @param {HTMLElement} el - The element with a data-action and optional data-action-type attribute.
   * @returns {Object<(string|undefined),string>} An object with the action name and event type.
   */
  static parseAction(el: HTMLElement) {
    return {
      name: el.dataset.action,
      type: el.dataset.actionType ?? "click",
    };
  }

  /**
   * Get a single instance of Domodule.
   *
   * @param {HTMLElement} element - An element with a given data-module attribute.
   * @returns {boolean|Domodule} The class instance, or "false" if it doesn't exist.
   */
  static getInstance(element: HTMLElement) {
    if (element.dataset.moduleUid && window.domorefs)
      return window.domorefs[element.dataset.moduleUid];

    Domodule.log(
      `The dataset of ${element.getAttribute("id") || "NO ID"} has no UID.`
    );
    return false;
  }

  /**
   * Add a Domodule instance to the global window object, if it does not exist.
   *
   * @param {string|Domodule} name - The data-module name or the instance itself.
   * @param {Domodule} cls - The instance, if name is provided.
   */
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

  /**
   * Discover and register all Domodule DOM objects.
   *
   * @param {string|HTMLElement|Array<HTMLElement>} el - The parent element or elements to traverse.
   * @returns {Array<Domodule>|undefined} An array of all registered Domodule instances, or undefined if no matches are found.
   */
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

  /**
   * Logs a message to the Javascript console.
   *
   * @param {string} msg - The message to print.
   * @static
   */
  static log(msg: string) {
    console.log(`[DOMODULE] ${msg}`); //eslint-disable-line no-console
  }

  /**
   * Logs an error to the Javascript console.
   *
   * @param {string} msg - The error to print.
   * @static
   */
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
