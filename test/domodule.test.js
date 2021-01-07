/* eslint no-console: 0 */
import Domodule from '..';
import Example from './module';

let modules;

const setup = () => {
  let container = document.createElement('div');
  container.id = 'domodule';
  document.body.appendChild(container);
  container = document.getElementById('domodule');
  container.innerHTML = `
    <button type="button" id="anotherbutton"></button>
    <div id="ExampleModule" data-module="Example" data-module-test="true" data-module-important="This is important" data-module-title="Example Module" data-module-global-screen="screen" data-action="click">
      <div data-action="testMouseOver" data-action-type="mouseover" style="height: 100px; width: 100px; background: black"></div>
      <div data-name="tester"></div>
      <span data-name="spanme"></span>
      <div id="Nested" data-module="Nested">
        <button type="button" data-action="nestedAction">NESTED BUTTON</button>
      </div>
    </div>
  `;

  modules = Domodule.discover();
};

beforeEach(() => setup());

describe('register module via constructor', () => {
  const container = document.createElement('div');
  const module = new Domodule(container, 'ModuleName');

  test('module is registered and id is set', () => {
    expect(module.id).toBeDefined();
  });

  test('module name is set', () => {
    expect(module.moduleName).toStrictEqual('ModuleName');
  });
});

describe('example module registered', () => {
  test('one module registered', () => {
    expect(typeof window.domodules).toMatch('object');
    expect(Object.keys(window.domodules).length).toBe(1);
  });

  test('class registered modules take name from class', () => {
    expect(window.domodules.Example).toBeDefined();
  });

  test('name registered modules take name from parameter', () => {
    Domodule.register('MyComplicatedName', Example);
    expect(window.domodules.MyComplicatedName).toBeDefined();
  });
});

describe('discover', () => {
  test('module found', () => {
    expect(modules.length).toBe(1);
  });
});

describe('pre/post init', () => {
  test('pre init called', () => {
    const instance = modules[0];
    expect(instance.events[0]).toMatch('pre init');
  });

  test('post init called', () => {
    const instance = modules[0];
    expect(instance.events[1]).toMatch('post init');
  });
});

describe('actions', () => {
  let instance;

  beforeAll(() => {
    instance = modules[0];
    instance.findByName('test0').click();
  });

  test('Action passed data', () => {
    expect(instance.events.indexOf('clicked index 0')).not.toBe(-1);
  });

  test('Should have processed = true', () => {
    // the original comparison was checking if the variable returned a truthy value, but the value received
    // is actually a string, so we could receive the value "false", which should NOT pass this test
    expect(instance.findByName('test0').dataset.domoduleActionProcessed).toMatch('true');
  });
});

describe('Actions are bound once', () => {
  let instance;
  let setups;

  beforeAll(() => {
    instance = modules[0];
    setups = instance.setUps.actions.length;
  });

  test('Two actions triggered', () => {
    expect(setups).toBe(2);
  });

  test('Redoing setup doesn\'t add new setups', () => {
    instance.setUps.actions.length = 0;
    instance.setupActions();
    expect(instance.setUps.actions.length).toBe(0);
  });

  test('If action processed is set to false it can be re-bound', () => {
    instance.el.dataset.domoduleActionProcessed = 'false';
    instance.setupActions();
    expect(instance.setUps.actions.length).toBe(1);
  });
});

describe('action on module', () => {
  let instance;

  beforeAll(() => {
    instance = modules[0];
    instance.events = [];
    instance.el.click();
  });

  test('Action fired on event', () => {
    expect(instance.events.indexOf('clicked')).not.toBe(-1);
  });

  test('Should have processed = true', () => {
    expect(document.getElementById('ExampleModule').dataset.domoduleActionProcessed).toMatch('true');
  });
});

describe('destroy module', () => {
  let instance;
  let moduleEl;

  beforeAll(() => {
    instance = modules[0];
    moduleEl = document.getElementById('ExampleModule');
    instance.destroy();
    instance.events = [];
    instance.el.click();
  });

  test('Action not fired on event', () => {
    // Original value in this test was 0, but that is not consistent with the "Action fired on event" test.
    // Whatsmore, testing against 0 make the test fail when it apparently shouldn't.
    expect(instance.events.indexOf('clicked')).toBe(-1);
  });

  test('Should have processed = false', () => {
    expect(moduleEl.dataset.domoduleActionProcessed).toMatch('false');
  });
});

describe('refs and getInstance', () => {
  setup();

  test('Refs object exists', () => {
    expect(window.domorefs).toBeDefined();
    expect(window.domorefs instanceof Object).toBeTruthy();
  });

  test('getInstance returns module instance', () => {
    expect(Domodule.getInstance(document.getElementById('ExampleModule')) instanceof Domodule).toBeTruthy();
  });
});

describe('find', () => {
  const instance = modules[0];
  const otherbutton = document.getElementById('anotherbutton');

  test('Finds elements in module', () => {
    expect(instance.find('button').length).toBeGreaterThan(0);
  });

  test('Elements are limited to those inside the module', () => {
    expect(instance.find('button').some(b => b === otherbutton)).toBeFalsy();
  });
});

describe('findOne', () => {
  const instance = modules[0];
  const found = instance.findOne('button');
  const buttons = instance.find('button');

  test('Finds single element in module', () => {
    expect(found instanceof Node).toBeTruthy();
  });

  test('Returns first element', () => {
    expect(found).toEqual(buttons[0]);
  });

  test('Should return null if element not found', () => {
    expect(instance.findOne('blink')).toBeNull();
  });
});

describe('named', () => {
  const instance = modules[0];

  test('Should return element by name', () => {
    expect(instance.findByName('tester') instanceof Node).toBeTruthy();
  });

  test('Should have processed = true', () => {
    expect(instance.findByName('tester').dataset.domoduleNameProcessed).toMatch('true');
  });
});

describe('options', () => {
  const instance = modules[0];

  test('Should have options', () => {
    expect(instance.getOption('test')).toMatch('true');
  });

  test('Should pull global vars', () => {
    expect(instance.getOption('screen')).toEqual(window.screen);
  });

  test('Default options should get overwritten', () => {
    expect(instance.getOption('title')).toMatch('Example Module');
  });

  test('Should have default options', () => {
    expect(instance.getOption('color')).toMatch('red');
  });
});

describe('required action', () => {
  const container = document.getElementById('domodule');

  test('Should throw if required action is missing', () => {
    container.innerHTML = `
      <div id="ExampleModule" data-module="Example" data-module-test="true" data-module-title="Example Module" data-module-global-screen="screen"></div>
    `;
    expect(() => Domodule.discover()).toThrow(/testMouseOver is required as actions for Example, but is missing!/);
  });
});

describe('required named', () => {
  const container = document.getElementById('domodule');

  test('Should throw if required named is missing', () => {
    container.innerHTML = `
      <div id="ExampleModule" data-module="Example" data-module-test="true" data-module-title="Example Module" data-module-global-screen="screen">
        <div data-action="testMouseOver" data-action-type="mouseover" style="height: 100px; width: 100px; background: black"></div>
        <span data-name="spanme"></span>
      </div>
    `;
    expect(() => Domodule.discover()).toThrow(/tester is required as named for Example, but is missing!/);
  });
});

describe('required option', () => {
  const container = document.getElementById('domodule');

  test('Should throw if required option is missing', () => {
    container.innerHTML = `
      <div id="ExampleModule" data-module="Example" data-module-test="true" data-module-global-screen="screen">
        <div data-action="testMouseOver" data-action-type="mouseover" style="height: 100px; width: 100px; background: black"></div>
        <div data-name="tester"></div>
        <span data-name="spanme"></span>
      </div>
    `;
    expect(() => Domodule.discover()).toThrow(/important is required as options for Example, but is missing!/);
  });
});

describe('nested modules', () => {
  const instance = modules[0];

  test('Nested action not processed', () => {
    expect(instance.find('[data-action="nestedAction"]')[0].dataset.domoduleActionProcessed).toBeFalsy();
  });
});
