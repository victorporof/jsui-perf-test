import { Element } from "./jsui-element";
import { DOMNode } from "./jsui-primitive";

export default class JsUI {
  static createElement(type, props, ...children) {
    if (typeof type == "string") {
      return new Element(DOMNode, props, children, { tag: type });
    }
    return new Element(type, props, children);
  }
}

export { Component } from "./jsui-component";
