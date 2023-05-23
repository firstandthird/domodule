/**
 * Defines class-based JavaScript modules accessible via the DOM.
 * @packageDocumentation
 */

import { find, findOne, on } from "domassist";
import attrObj from "attrobj";
import parentModule from "./getParentModule";

/**
 * The generic structure of an attribute object.
 * @public
 */
export interface AttrObj {
  [index: string]: string;
}

/**
 * Defines any action listener callback on Domodule.
 * @public
 */
export type DomoduleAction = (
  actionEl: EventTarget | null,
  event: Event,
  actionData: AttrObj
) => any;

/**
 * A catch-all type for Domodule setting blocks.
 *
 * @example
 * The `required` property on an instance:
 * ```
 * this.required: DomoduleSettings = {
 *     actions: ['click'],
 *     options: ['example'],
 * }
 * ```
 * @public
 */
export type DomoduleSettings = {
  [index: string]: string[];
};

const ACTION_SELECTOR = "[data-action]";
const DOMAssist = { find, findOne, on };

/**
 * Defines class-based JavaScript modules accessible via the DOM.
 * @public
 */
export default class Domodule {
  /** The element referenced by the module. */
  readonly el: HTMLElement;
  /** Module options included from `data-module-*` attributes. */
  readonly options: AttrObj;
  /** The name of the module, as referenced in code. */
  readonly moduleName: string;

  /** Child elements of Domodule denoted by `data-name` attributes. */
  els: { [index: string]: HTMLElement | HTMLElement[] };
  /** The object that contains all options during initialization. */
  setUps: DomoduleSettings;
  /** The ID of a Domodule instance. */
  id: string;

  /** General type definition that accepts any user-defined callbacks.
   *
   * @remarks
   * It is the user's responsibility to ensure they do not override core Domodule functions unless they have a very specific reason to do so.
   */
  [index: string]: any;

  /**
   * @param el - The element referenced by the module.
   * @param name - The name of the module, as referenced in code.
   * @returns An instance of the Domodule class.
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

  /**
   * The required settings for a Domodule instance.
   *
   * @remarks
   * If any of these indices are absent from Domodule.setUps, the instance throws an error on initialization.
   * @returns The required settings object.
   */
  get required(): DomoduleSettings {
    return {};
  }

  /**
   * The default 'options' settings for a Domodule instance.
   *
   * @returns The settings object. These values are copied to Domodule.setUps on initialization.
   */
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

  /** Generates a unique ID for every new instance and assigns it to Domodule.id. */
  private generateUuid() {
    this.id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Adds a discovered instance as a reference to the global `window.domorefs` object.
   *
   * @returns `false` if the module UID exists, otherwise `undefined`.
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

  /** Finds all DOM elements with `data-action` defs and initializes them. */
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
   * @param actionEl - The element that triggers the JS event.
   */
  private setupAction(actionEl: HTMLElement) {
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
   * @param event - The triggered event object.
   */
  private actionRouter = (event: Event) => {
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

  /** Adds all children of a module with a set `data-name` as references. */
  private setupNamed() {
    this.find("[data-name]").forEach((named) => {
      if (!named.dataset.name) return;
      const nameKey = named.dataset.name;
      const parent = parentModule(named);

      if (parent !== this.el) {
        return;
      }

      if (!named.dataset.domoduleNameProcessed) {
        if (!this.els[nameKey]) {
          this.els[nameKey] = named;
        } else if (Array.isArray(this.els[nameKey])) {
          (this.els[nameKey] as HTMLElement[]).push(named);
        } else {
          this.els[nameKey] = [this.els[nameKey] as HTMLElement, named];
        }

        this.storeSetUp(named.dataset.name, "named");
        named.dataset.domoduleNameProcessed = "true";
        named.dataset.domoduleOwner = this.id;
      }
    });
  }

  /**
   * Stores module options and references on the instance.
   *
   * @param name - The name of the option or reference.
   * @param dict - The Domodule.setUps index.
   */
  private storeSetUp(name: string, dict: string) {
    if (this.setUps[dict] === undefined) {
      this.setUps[dict] = [];
    }

    if (this.setUps[dict].indexOf(name) < 0) {
      this.setUps[dict].push(name);
    }
  }

  /**
   * Validates Domodule.setUps and throws an error if settings are missing.
   *
   * @returns The instanced object.
   */
  private verifyRequired() {
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
   * @param selector - The value to search.
   * @returns The array of elements matching the selector.
   */
  find(selector: string | HTMLElement | NodeList) {
    return DOMAssist.find(selector, this.el);
  }

  /**
   * Returns the first instance of the DOM matching a CSS selector.
   *
   * @param selector - The identifier to search.
   * @returns The first matching element, or null.
   */
  findOne(selector: string) {
    return DOMAssist.findOne(selector, this.el);
  }

  /**
   * Returns the DOM element with the matching `data-name` attribute.
   *
   * @param name - The `data-name` of the element.
   * @returns The matching element(s), or undefined.
   */
  findByName(name: string): HTMLElement | HTMLElement[] | undefined {
    return this.els[name];
  }

  /**
   * Returns the value of a single option in the module.
   *
   * @param option - The option's index.
   * @returns The option's value.
   */
  getOption(option: string) {
    return this.options[option];
  }

  /** Unbinds all action listeners from a Domodule instance. */
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
   * @param msg - The message to print.
   */
  protected log(msg: string) {
    Domodule.log(`${this.constructor.name}: ${msg}`);
  }

  /**
   * Logs an error to the Javascript console.
   *
   * @param msg - The error to print.
   */
  protected error(msg: string) {
    Domodule.error(`${this.constructor.name}: ${msg}`);
  }

  /**
   * Gets the action callback and event type arguments from a DOM element.
   *
   * @param el - The element with a `data-action` and optional `data-action-type` attribute.
   * @returns An object with the action name and event type.
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
   * @param element - An element with a given `data-module` attribute.
   * @returns The class instance, or "false" if it doesn't exist.
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
   * @param name - The data-module name or the instance itself.
   * @param cls - The instance, if name is provided.
   */
  static register(name: string | typeof Domodule, cls?: typeof Domodule) {
    if (typeof name !== "string") {
      cls = name;
      name = cls.prototype.constructor.name;
    } else if (typeof name === "string" && typeof cls === "undefined") {
      throw new Error(
        `No Domodule class instance was provided in either parameter.`
      );
    }

    if (!window.domodules) {
      window.domodules = {};
    }

    Domodule.log(`Registering ${name}`);
    window.domodules[name] = cls as unknown as Domodule;
  }

  /**
   * Discover and register all Domodule instances in the DOM.
   *
   * @param el - The parent element or elements to traverse.
   * @returns An array of all registered Domodule instances, or undefined if no matches are found.
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
   * @param msg - The message to print.
   */
  static log(msg: string) {
    console.log(`[DOMODULE] ${msg}`); //eslint-disable-line no-console
  }

  /**
   * Logs an error to the Javascript console.
   *
   * @param msg - The error to print.
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
