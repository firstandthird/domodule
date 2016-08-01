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

    const showButton = document.createElement('button');
    showButton.dataset.name = `test-show`;
    showButton.dataset.action = 'showClick';
    showButton.textContent = `Show`;
    const hideButton = document.createElement('button');
    hideButton.dataset.name = `test-hide`;
    hideButton.dataset.action = 'hideClick';
    hideButton.textContent = `Hide`;

    newEl.appendChild(showButton);
    newEl.appendChild(hideButton);

    this.el.appendChild(newEl);
    this.setupActions();
    this.setupNamed();

    console.log('Example initialized');
  }

  testMouseOver(el, event, values) {
    console.log(el, event, values);
    console.log(this.els);
  }

  click(el, event, values) {
    console.log('clicked', el, values);
    console.log(`clicked index ${values.index}`);
    return false;
  }

  showClick() {
    console.log('Clicked show');
    this.show(this.els.testMouseOverEl);
  }

  hideClick() {
    console.log('Clicked hide');
    this.hide(this.els.testMouseOverEl);
  }
}
Domodule.register('Example', Example);
Domodule.discover();
