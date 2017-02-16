5.1.1 / 2017-02-16
==================

  * fixing actionRouter to use currentTarget instead of target

5.1.0 / 2017-02-09
==================

  * adding proper parent checking and uuid

5.0.1 / 2017-02-06
==================

  * adding module property

5.0.0 / 2017-02-05
==================

  * using scriptkit
  * enabling debug from localstorage
  * cleaned setupActions
  * require data-action on top level module
  * adding checks for required actions/options/named
  * using domassist for dom interaction
  * added destroy method
  * allowing default options to be set
  * updated deps

4.0.1 / 2017-01-26
==================

  * updated attrobj
  * removed `for of` statements
  * removed core-js depedency

4.0.0 / 2016-12-28
==================

  * swap out serializeAttributes with attrObj
  * updated dev deps
  * added travis
  * chore(package): update dependencies
  * removed dist file (will be published with npm)
  * pull in name of module from constructor.name
  * added pre/post init hooks
  * auto discover
  * default debug to false
  * debug mode
  * returns instances from discover call
  * migrated tests, now runs in console

3.1.1 / 2016-12-11
==================

  * Add browserify transform options.

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
