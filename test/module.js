
import Domodule from '../lib/domodule';
export default class Example extends Domodule {
  constructor(el) {
    super(el, ['test']);

    this.events = [];

    // this gets added after events are bound and events named
    const newEl = document.createDocumentFragment();

    for (let i = 0; i < 5; i++) {
      const temp = document.createElement('button');

      temp.dataset.name = `test${i}`;
      temp.dataset.action = 'click';
      temp.dataset.actionIndex = i;
      temp.textContent = `Click me! ${i}`;

      newEl.appendChild(temp);
    }

    this.el.appendChild(newEl);
    this.setupActions();
    this.setupNamed();

    this.events.push('Example initialized');
  }

  testMouseOver(el, event, values) {
    this.events.push({ el, event, values });
    this.events.push(this.els);
  }

  click(el, event, values = {}) {
    this.events.push('clicked');
    this.events.push(`clicked index ${values.index}`);
    return false;
  }

  nestedAction() {
    this.events.push('this shouldnt fire');
  }
}
Domodule.register('Example', Example);
Domodule.discover();
