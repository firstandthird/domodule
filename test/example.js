/* eslint no-console:0 */

import Domodule from '../';
export default class Example extends Domodule { // eslint-disable-line no-unused-vars
  constructor(el) {
    super(el, ['test']);

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

    console.log('Example initialized');
  }

  testMouseOver(el, event, values) {
    console.log(el, event, values);
    console.log(this.els);
  }

  click(el, event, values = {}) {
    console.log('clicked', el, values);

    console.log(`clicked index ${values.index}`);
    return false;
  }
}
Domodule.register('Example', Example);
Domodule.discover();
