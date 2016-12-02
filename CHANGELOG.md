3.1.0 / 2016-12-01
==================

  * Fixes a bug from last version where `parentModule` wouldn't return correctly.

3.0.0 / 2016-11-24
==================

  * Allows modules to be nested. Potentially breaking change. Check if your modules are nested before upgrading.


2.2.2 / 2016-11-02
==================

  * updated package, removed transform

2.2.1 / 2016-11-02
==================

  * added browser field

2.2.0 / 2016-10-19
==================

  * removed dist/index
  * updated package.json to include transform
  * eslint
  * switched to npm scripts over gulp. moved example to test
  * static method for nodeListToArray
  * added second param to find to turn nodelist into array

2.1.0 / 2016-09-08
==================

  * actions can now be bound to module element

2.0.1 / 2016-07-20
==================

  * use forEach instead of Array.values

2.0.0 / 2016-07-14
==================

  * updated gitignore
  * removed example dist files
  * cleaned up gulp to just have test run through browserify/babel
  * example: test now handles loading files
  * have test import domodule and example
  * example: import domodule and register itself
  * fixed default export
  * BREAKING: added Domodule.register(name, cls);
  * make npm start work
  * export Domodule class
