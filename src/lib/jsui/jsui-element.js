import assert from "assert";

import { shallowDiff } from "./jsui-diff";
import * as Primitive from "./jsui-primitive";
import { lockstepArr } from "./jsui-util";

export const ELEMENT_REF = Symbol("JsUI Element");
export const NEXT_STATE = Symbol("JsUI Next State");

let count = 0;

export class Element {
  constructor(type, props, children, meta) {
    this.type = type;
    this.props = props ?? {};
    this.props.children = children?.map(Element.sanitize);
    this.meta = meta;
  }

  static sanitize(element) {
    if (element instanceof Element) {
      return element;
    }
    if (element instanceof Array) {
      return new Element(Primitive.DOMFragment, null, element);
    }
    if (typeof element == "number" || typeof element == "string") {
      return new Element(Primitive.TextLeaf, null, null, { value: `${element}` });
    }
    if (element == null) {
      return new Element(Primitive.NullLeaf);
    }
    assert.fail();
  }

  tryReusing(element) {
    if (this == element) {
      return;
    }
    if (this.type != element?.type) {
      return;
    }
    assert(!this.uid);
    assert(!this.component);
    assert(!this.rendered);

    this.uid = element.uid;

    this.component = element.component;
    this.component[ELEMENT_REF] = this;

    this.rendered = element.rendered;
  }

  ensureInstanced() {
    if (this.component) {
      return;
    }

    const Constructor = this.type;
    this.component = new Constructor();
    this.component[ELEMENT_REF] = this;

    this.uid = `${count++}`;

    this.reconciler.onInstantiated(this);
  }

  update(scheduler, reconciler, prevSelf, parentElement) {
    this.scheduler = scheduler;
    this.reconciler = reconciler;

    this.tryReusing(prevSelf);
    this.ensureInstanced();

    const nextState = this.component[NEXT_STATE] ?? this.component.state;
    this.component[NEXT_STATE] = null;

    if (this.rendered && !this.component.shouldComponentUpdate(this.props, nextState)) {
      return;
    }

    this.component.props = this.props;
    this.component.state = nextState;

    const prevRenderedElement = this.rendered;
    const nextRenderedElement = (this.rendered = Element.sanitize(this.component.render()));
    const forwardParentElement = this.type == Primitive.DOMNode ? this : parentElement;

    shallowDiff(prevSelf, this, parentElement, reconciler);

    if (this.isUserComponent()) {
      nextRenderedElement.update(scheduler, reconciler, prevRenderedElement, forwardParentElement);
      return;
    }

    if (this.isDOMNodeOrFragment() || this.isRoot()) {
      const prevChildren = prevRenderedElement?.props.children;
      const nextChildren = nextRenderedElement.props.children;
      lockstepArr(prevChildren, nextChildren, (prevChildElement, nextChildElement) => {
        nextChildElement.update(scheduler, reconciler, prevChildElement, forwardParentElement);
      });
    }
  }

  isRoot() {
    assert(this.component);
    return this.component instanceof Primitive.RootNode;
  }

  isDOMNodeOrFragment() {
    assert(this.component);
    return this.component instanceof Primitive.DOMNodeOrFragment;
  }

  isUserComponent() {
    assert(this.component);
    return !(this.component instanceof Primitive.InternalComponent);
  }
}
