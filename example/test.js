/* eslint no-console: 0 */

import Domodule from '../lib/domodule';
import Example from './example';

import { test } from 'tape';

test('implementation', assert => {
  /*
    These don't really test the class as they're really just to
    make sure the testing environment is setup correctly.
  */
  assert.ok(Array.isArray(window.logHistory), 'window.logHistory setup');
  assert.equal(typeof Domodule, 'function', 'Domodule class exists');
  assert.equal(typeof Example, 'function', 'Example class exists');
  assert.ok(Example.prototype instanceof Domodule, 'Example extends Domodule');

  assert.end();
});

test('constructor', assert => {
  assert.equal(typeof Domodule.constructor, 'function', 'Constructor exists');
  assert.ok(window.logHistory.indexOf('Example initialized') !== -1, 'Constructor called');

  assert.end();
});

test('actions', assert => {
  Domodule.getInstance(document.getElementById('ExampleModule')).findByName('test0').click();
  assert.ok(window.logHistory.indexOf('clicked') !== -1, 'Action fired on event');
  assert.ok(window.logHistory.indexOf('clicked index 0') !== -1, 'Action passed data');
  assert.ok(Domodule.getInstance(document.getElementById('ExampleModule')).findByName('test0').dataset.domoduleActionProcessed, 'Should have processed = true');

  assert.end();
});

test('refs', assert => {
  assert.ok(typeof Domodule.refs !== 'undefined' && Domodule.refs instanceof Object, 'Refs object exists');
  assert.ok(Domodule.getInstance(document.getElementById('ExampleModule')) instanceof Domodule, 'getInstance returns module instance');

  assert.end();
});

test('find', assert => {
  assert.ok(Domodule.getInstance(document.getElementById('ExampleModule')).find('button').length > 0, 'Finds elements in module');

  assert.end();
});

test('findOne', assert => {
  assert.equal(Domodule.getInstance(document.getElementById('ExampleModule')).findOne('button').dataset.name, 'test0', 'Finds single element in module');
  assert.ok(Domodule.getInstance(document.getElementById('ExampleModule')).findOne('blink') === null, 'Should return null if element not found');

  assert.end();
});

test('named', assert => {
  assert.ok(Domodule.getInstance(document.getElementById('ExampleModule')).findByName('tester') instanceof Node, 'Should return element by name');
  assert.ok(Domodule.getInstance(document.getElementById('ExampleModule')).findByName('tester').dataset.domoduleNameProcessed, 'Should have processed = true');

  assert.end();
});

test('options', assert => {
  assert.ok(Domodule.getInstance(document.getElementById('ExampleModule')).getOption('test'), 'Should have options');
  assert.ok(Domodule.getInstance(document.getElementById('ExampleModule')).getOption('screen') === window.screen, 'Should pull global vars');

  assert.end();
});

test('hide', assert => {
  const instance = Domodule.getInstance(document.getElementById('ExampleModule'));
  const tester = instance.els.tester;

  instance.hide(tester);

  assert.ok(tester.style.display === 'none', 'Should hide elements');

  assert.end();
});

test('show', assert => {
  const instance = Domodule.getInstance(document.getElementById('ExampleModule'));
  const tester = instance.els.tester;

  instance.hide(tester);
  instance.show(tester);

  assert.ok(tester.style.display === 'block', 'Should show elements');

  instance.show(tester, 'inline');
  assert.ok(tester.style.display === 'inline', 'Should be able to pass other display properties');
  instance.show(tester);

  assert.end();
});
