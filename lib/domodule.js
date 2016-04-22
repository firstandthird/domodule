class Domodule {
  constructor(el) {
    this.el = el;
    this.els = {};
    this.options = this.serializeAttrs('module', this.el);

    this.setupActions();
    this.setupNamed();

    return this;
  }

  setupNamed() {
    for (const named of this.find('[data-name]')) {
      if (!named.dataset.domoduleNameProcessed) {
        this.els[named.dataset.name] = named;
        named.dataset.domoduleNameProcessed = true;
      }
    }
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

  serializeAttrs(key, el) {
    const values = {};

    for (const data in el.dataset) {
      if (el.dataset.hasOwnProperty(data) && data.startsWith(key) && data !== key) {
        let optionName = data.replace(key, '');
        optionName = optionName[0].toLowerCase() + optionName.slice(1);
        values[optionName] = el.dataset[data];
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
}
