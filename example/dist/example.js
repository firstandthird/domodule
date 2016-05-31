'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global Domodule */
/* eslint no-console:0 */

var Example = function (_Domodule) {
  _inherits(Example, _Domodule);

  // eslint-disable-line no-unused-vars

  function Example(el) {
    _classCallCheck(this, Example);

    // this gets added after events are bound and events named

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Example).call(this, el, ['test']));

    var newEl = document.createDocumentFragment();

    for (var i = 0; i < 5; i++) {
      var temp = document.createElement('button');

      temp.dataset.name = 'test' + i;
      temp.dataset.action = 'click';
      temp.dataset.actionIndex = i;
      temp.textContent = 'Click me! ' + i;

      newEl.appendChild(temp);
    }

    _this.el.appendChild(newEl);
    _this.setupActions();
    _this.setupNamed();

    console.log('Example initialized');
    return _this;
  }

  _createClass(Example, [{
    key: 'testMouseOver',
    value: function testMouseOver(el, event, values) {
      console.log(el, event, values);
      console.log(this.els);
    }
  }, {
    key: 'click',
    value: function click(el, event, values) {
      console.log('clicked', el, values);
      console.log('clicked index ' + values.index);
      return false;
    }
  }]);

  return Example;
}(Domodule);