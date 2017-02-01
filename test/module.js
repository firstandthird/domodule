
import Domodule from '../lib/domodule';
export default class Example extends Domodule {

  preInit() {
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
    this.events.push('pre init');
  }

  postInit() {
    this.events.push('post init');
  }

  get required() {
    return {
      actions: ['testMouseOver'],
      named: ['tester'],
      options: ['title']
    };
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
Domodule.register(Example);
Domodule.discover();
