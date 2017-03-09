/* eslint no-console: 0 */

import Domodule from '../lib/domodule';
import Example from './module';

import test from 'tape-rollup';

const init = () => {
  const container = document.createElement('div');
  container.id = 'domodule';
  document.body.appendChild(container);
};

const createClick = () => {
  const ev = document.createEvent('MouseEvent');
  ev.initMouseEvent(
    'click',
    true /* bubble */, true /* cancelable */,
    window, null,
    0, 0, 0, 0, /* coordinates */
    false, false, false, false, /* modifier keys */
    0, null
  );

  return ev;
};

const setup = () => {
  const container = document.getElementById('domodule');
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

  return Domodule.discover();
};

init();

test('example module registerd', assert => {
  assert.equal(typeof Domodule.modules, 'object');
  assert.equal(Object.keys(Domodule.modules).length, 1, 'one module registered');
  assert.notEqual(typeof Domodule.modules.Example, 'undefined', 'class registered modules take name from class');
  Domodule.register('MyComplicatedName', Example);
  assert.notEqual(typeof Domodule.modules.MyComplicatedName, 'undefined', 'name registered modules take name from parameter');

  assert.end();
});

test('discover', assert => {
  const modules = setup();
  const instance = modules[0];

  assert.equal(modules.length, 1, 'module found');
  assert.equal(instance.options.test, 'true', 'test is valid');
  assert.equal(instance.options.important, 'This is important', 'important is valid');
  assert.equal(instance.options.title, 'Example Module', 'title is valid');
  assert.end();
});

test('discover alternative naming', assert => {
  const container = document.getElementById('domodule');
  container.innerHTML = `
    <button type="button" id="anotherbutton"></button>
    <div id="ExampleModule" data-example data-example-test="true" data-example-important="This is important" data-example-title="Example Module" data-example-global-screen="screen" data-action="click">
      <div data-action="testMouseOver" data-action-type="mouseover" style="height: 100px; width: 100px; background: black"></div>
      <div data-name="tester"></div>
      <span data-name="spanme"></span>
      <div id="Nested" data-module="Nested">
        <button type="button" data-action="nestedAction">NESTED BUTTON</button>
      </div>
    </div>
  `;

  const instance = Domodule.discover()[0];
  assert.equal(instance.options.test, 'true', 'test is valid');
  assert.equal(instance.options.important, 'This is important', 'important is valid');
  assert.equal(instance.options.title, 'Example Module', 'title is valid');
  assert.end();
});

test('pre/post init', assert => {
  const modules = setup();
  const instance = modules[0];
  assert.equal(instance.events[0], 'pre init', 'pre init called');
  assert.equal(instance.events[1], 'post init', 'pre init called');
  assert.end();
});

test('actions', assert => {
  const modules = setup();
  const instance = modules[0];
  instance.findByName('test0').click();
  assert.ok(instance.events.indexOf('clicked index 0') !== -1, 'Action passed data');
  assert.ok(instance.findByName('test0').dataset.domoduleActionProcessed, 'Should have processed = true');
  assert.end();
});

test('action on module', assert => {
  const modules = setup();
  const instance = modules[0];
  instance.events = [];
  instance.el.dispatchEvent(createClick());
  assert.ok(instance.events.indexOf('clicked') !== -1, 'Action fired on event');
  assert.ok(document.getElementById('ExampleModule').dataset.domoduleActionProcessed, 'Should have processed = true');
  assert.end();
});

test('destroy module', assert => {
  const modules = setup();
  const instance = modules[0];
  const moduleEl = document.getElementById('ExampleModule');
  instance.destroy();
  instance.events = [];
  instance.el.dispatchEvent(createClick());

  assert.equal(instance.events.length, 0, 'Action not fired on event');
  assert.equal(moduleEl.dataset.domoduleActionProcessed, 'false', 'Should have processed = false');
  assert.end();
});

test('refs and getInstance', assert => {
  setup();
  assert.ok(typeof Domodule.refs !== 'undefined' && Domodule.refs instanceof Object, 'Refs object exists');
  assert.ok(Domodule.getInstance(document.getElementById('ExampleModule')) instanceof Domodule, 'getInstance returns module instance');

  assert.end();
});

test('find', assert => {
  const modules = setup();
  const instance = modules[0];
  const otherbutton = document.getElementById('anotherbutton');
  assert.ok(instance.find('button').length > 0, 'Finds elements in module');
  assert.notOk(instance.find('button').some(b => b === otherbutton), 'Elements are limited to those inside the module');
  assert.end();
});

test('findOne', assert => {
  const modules = setup();
  const instance = modules[0];
  const found = instance.findOne('button');
  const buttons = instance.find('button');

  assert.ok(found instanceof Node, 'Finds single element in module');
  assert.equal(found, buttons[0], 'Returns first element');
  assert.ok(instance.findOne('blink') === null, 'Should return null if element not found');
  assert.end();
});

test('named', assert => {
  const modules = setup();
  const instance = modules[0];
  assert.ok(instance.findByName('tester') instanceof Node, 'Should return element by name');
  assert.ok(instance.findByName('tester').dataset.domoduleNameProcessed, 'Should have processed = true');
  assert.end();
});

test('options', assert => {
  const modules = setup();
  const instance = modules[0];
  assert.ok(instance.getOption('test'), 'Should have options');
  assert.equal(instance.getOption('screen'), window.screen, 'Should pull global vars');
  assert.equal(instance.getOption('title'), 'Example Module', 'Default options should get overwritten');
  assert.equal(instance.getOption('color'), 'red', 'Should have default options');

  assert.end();
});

test('required action', assert => {
  const container = document.getElementById('domodule');
  container.innerHTML = `
    <div id="ExampleModule" data-module="Example" data-module-test="true" data-module-title="Example Module" data-module-global-screen="screen"></div>`;

  assert.throws(Domodule.discover, /testMouseOver is required as actions for Example, but is missing!/, 'Should throw if required action is missing');
  assert.end();
});

test('required named', assert => {
  const container = document.getElementById('domodule');
  container.innerHTML = `
    <div id="ExampleModule" data-module="Example" data-module-test="true" data-module-title="Example Module" data-module-global-screen="screen">
      <div data-action="testMouseOver" data-action-type="mouseover" style="height: 100px; width: 100px; background: black"></div>
      <span data-name="spanme"></span>
    </div>
`;

  assert.throws(Domodule.discover, /tester is required as named for Example, but is missing!/, 'Should throw if required named is missing');
  assert.end();
});

test('required option', assert => {
  const container = document.getElementById('domodule');
  container.innerHTML = `
    <div id="ExampleModule" data-module="Example" data-module-test="true" data-module-global-screen="screen">
      <div data-action="testMouseOver" data-action-type="mouseover" style="height: 100px; width: 100px; background: black"></div>
      <div data-name="tester"></div>
      <span data-name="spanme"></span>
    </div>
  `;

  assert.throws(Domodule.discover, /important is required as options for Example, but is missing!/, 'Should throw if required option is missing');
  assert.end();
});

test('nested modules', assert => {
  const modules = setup();
  const instance = modules[0];
  assert.ok(!instance.find('[data-action="nestedAction"]')[0].dataset.domoduleActionProcessed, 'Nested action not processed');
  assert.end();
});
