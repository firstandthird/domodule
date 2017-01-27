/* eslint no-console: 0 */

import Domodule from '../lib/domodule';
//Domodule.debug = true;
import './module';

import test from 'tape-rollup';

const init = () => {
  const container = document.createElement('div');
  container.id = 'domodule';
  document.body.appendChild(container);
};

const setup = () => {
  const container = document.getElementById('domodule');
  container.innerHTML = `
    <div id="ExampleModule" data-module="Example" data-module-test="true" data-module-title="Example Module" data-module-global-screen="screen" data-action="click">
      <div data-action="testMouseOver" data-action-type="mouseover" style="height: 100px; width: 100px; background: black"></div>
      <div data-name="tester"></div>
      <span data-name="spanme"></span>
      <div id="Nested" data-module="Nested">
        <button type="button" data-action="nestedAction">NESTED BUTTON</button>
      </div>
    </div>
  `;
  const modules = Domodule.discover();
  return modules;
};

init();

//TODO: register with name and class and register with just class

test('example module registerd', assert => {
  assert.equal(typeof Domodule.modules, 'object');
  assert.equal(Object.keys(Domodule.modules).length, 1, 'one module registered');
  assert.end();
});

test('discover', assert => {
  const modules = setup();
  assert.equal(modules.length, 1, 'module found');
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
  instance.click();
  assert.ok(instance.events.indexOf('clicked') !== -1, 'Action fired on event');
  assert.ok(document.getElementById('ExampleModule').dataset.domoduleActionProcessed, 'Should have processed = true');
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
  assert.ok(instance.find('button').length > 0, 'Finds elements in module');
  assert.end();
});

test('findOne', assert => {
  const modules = setup();
  const instance = modules[0];
  assert.equal(instance.findOne('span').dataset.name, 'spanme', 'Finds single element in module');
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
  assert.ok(instance.getOption('screen') === window.screen, 'Should pull global vars');

  assert.end();
});
