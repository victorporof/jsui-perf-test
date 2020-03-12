import { Fragment, Nil, Text } from "./jsui-primitive";
import { lockstep } from "./jsui-util";

export const ELEMENT = Symbol("JsUI Element");

export class Element {
  constructor(type, props, children, meta) {
    this.type = type;
    this.props = props ?? {};
    Object.defineProperty(this.props, "children", {
      enumerable: false,
      value: children?.map(Element.sanitize)
    });
    this.meta = meta;
  }

  static sanitize(element) {
    if (element instanceof Element) {
      return element;
    }
    if (element instanceof Array) {
      return new Element(Fragment, null, element);
    }
    if (typeof element == "number" || typeof element == "string") {
      return new Element(Text, null, null, { value: element });
    }
    if (element == null) {
      return new Element(Nil);
    }
    throw new Error("Unknown element type");
  }

  getComponent() {
    if (this.component) {
      return this.component;
    }

    const Constructor = this.type;
    this.component = new Constructor();
    this.component[ELEMENT] = this;

    return this.component;
  }

  persistFrom(element) {
    if (this.type != element?.type) {
      return;
    }

    this.component = element.component;
    this.rendered = element.rendered;
    this.mounted = element.mounted;

    this.component[ELEMENT] = this;
  }

  updateTreeIn(container) {
    this.container = container;

    const component = this.getComponent();
    const nextState = this.nextState ?? component.state;

    if (this.rendered && !component.shouldComponentUpdate(this.props, nextState)) {
      return;
    }

    component.props = this.props;
    component.state = nextState;

    const prevRendered = this.rendered;
    const nextRendered = (this.rendered = Element.sanitize(component.render()));

    nextRendered.dom = prevRendered?.dom;

    lockstep(prevRendered?.props.children, nextRendered.props.children, (oldChild, newChild) => {
      newChild?.persistFrom(oldChild);
      newChild?.updateTreeIn(container);
    });

    if (!this.mounted) {
      this.mounted = true;
      requestAnimationFrame(() => {
        component.componentDidMount();
      });
    }
  }

  receiveState(nextState) {
    this.nextState = nextState;
    this.container.flushTreeWhenPossible();
  }
}
