class Example extends Domodule {
  constructor(el) {
    super(el);

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

    const firstButton = this.findOne('button');

    console.log(firstButton);
  }
  testMouseOver(el, event, values) {
    console.log(el, event, values);
    console.log(this.els);
  }

  click(el, event, values) {
    console.log('clicked', el, values);
    return false;
  }
}
