import { Element } from "./jsui-element";
import { DOMFragment, DOMText, Nil } from "./jsui-primitive";

export class Rendered {
  constructor(element) {
    this.element = Rendered.sanitize(element);
    this.owner = null;
    this.parent = null;
  }

  static sanitize(element) {
    if (element instanceof Element) {
      return element;
    }
    if (element instanceof Array) {
      return new Element(DOMFragment, null, element);
    }
    if (typeof element == "number" || typeof element == "string") {
      return new Element(DOMText, null, null, { value: `${element}` });
    }
    if (element == null) {
      return new Element(Nil);
    }
    throw new Error("Unknown element type");
  }

  get nonFragmentRendered() {
    if (this.element.type === DOMFragment) {
      return this.parent.rendered.nonFragmentRendered;
    }
    return this;
  }
}
