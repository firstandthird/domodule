<h1 align="center">domodule</h1>

<p align="center">
  <a href="https://github.com/firstandthird/domodule/actions">
    <img src="https://img.shields.io/github/workflow/status/firstandthird/domodule/Test/main?label=Tests&style=for-the-badge" alt="Test Status"/>
  </a>
  <a href="https://github.com/firstandthird/domodule/actions">
    <img src="https://img.shields.io/github/workflow/status/firstandthird/domodule/Lint/main?label=Lint&style=for-the-badge" alt="Lint Status"/>
  </a>
  <img src="https://img.shields.io/npm/v/domodule.svg?label=npm&style=for-the-badge" alt="NPM" />
</p>

Domodule is a helper that allows you to create javascript modules with minimal effort while keeping code size down. It automatically binds to elements using the `data-module` attribute.

## Installation

```sh
npm install domodule
```

_or_

```sh
yarn add domodule
```

## Example usage

```html
<div data-module="ExampleModule" data-module-title="Example Module">
  <div data-name="title"></div>
  <button type="button" data-action="click">Show Title</button>
</div>
```

```js
class ExampleModule extends Domodule {
  click() {
    this.els.title.textContent = this.options.title;
  }
}
```

### Inherited methods

Each module has access to these helper methods.

- `find(<selector>)` - Returns an array of matched elements inside of the module.
- `findOne(<selector>)` - Returns the first matched element inside of the module.
- `findByName(<element name>)` - Alternative to `this.els[name]`.
- `getOption(<option>)` - Returns value of an option (`data-module-*`).
- `setupActions()` - Used to bind actions. Useful if the module adds elements in after Domodule inits. **Note:** Called by default. Calling again wont re-process elements.
- `setupNamed()` - Same as `setupActions()` but binds to named elements. **Note:** Called by default. Calling again wont re-process elements.

### Static Methods

- `Domodule.getInstance(<element>)` - Returns an instance of the module.
- `Domodule.discover(<dom node, array of nodes, selector>)` - Looks for `data-module` inside of matched elements. Will skip elements already processed. Calling just `Domodule.discover()` will search for all modules in the body.

### Named elements

Adding `data-name=<name>` to an element will bind it to `this.els.<name>`. Only supports one element per name.

### Actions

Adding `data-action=<name>` to an element binds it to click (or optionally `data-action-type=<touch|mouseover|etc>`). Values can be passed through the event by adding data attributes starting with `data-action-`.

Create a method in the class matching the name given in the data attribute. Method will be passed: (the element, event object, values)

### Properties

- `this.el` - References the module element.
- `this.els` - Object containing all `data-name` elements
- `this.options` - Object containing anything passed in after `data-module-` (similar to action values).

#### constructor

A constructor method can be used but you will need to call `super(el)`. Constructor method gets el as it's only (and required) parameter. `super(el)` should be called before your code unless you need to modify core behavior. Element binding happens only when super is called.

### Required options

A module can pass an array of required options to the `super()` method. Module will fail to init if any number of the required options are not present. Example: `super(el, ['someOption', 'anotherOption'])`


---

<a href="https://firstandthird.com"><img src="https://firstandthird.com/_static/ui/images/safari-pinned-tab-62813db097.svg" height="32" width="32" align="right"></a>

_A [First + Third](https://firstandthird.com) Project_
