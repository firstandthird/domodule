class Domodule {
  constructor(el) {
    this.el = el;
    this.els = {};
    this.options = this.serializeAttrs('module', this.el);

    for (const action of this.find('[data-action]')) {
      action.addEventListener(
        action.dataset.actionType || 'click',
        event => {
          this[action.dataset.action].call(
            this,
            action,
            event,
            this.serializeAttrs('action', action)
          );
        }
      );
    }

    for (const named of this.find('[data-name]')) {
      this.els[named.dataset.name] = named;
    }

    return this;
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
}
