import { DOMFragment, DOMText } from "./jsui-primitive";
import { Rendered } from "./jsui-rendered";
import { lockstepArr } from "./jsui-util";

export const ELEMENT_REF = Symbol("JsUI Element");

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
      return new Element(DOMFragment, null, element);
    }
    if (typeof element == "number" || typeof element == "string") {
      return new Element(DOMText, null, null, { value: `${element}` });
    }
    throw new Error("Unknown child element type");
  }

  getComponent() {
    if (this.component) {
      return this.component;
    }

    const Constructor = this.type;
    this.component = new Constructor();
    this.component[ELEMENT_REF] = this;

    return this.component;
  }

  persistFrom(element) {
    if (this.type != element?.type) {
      return;
    }

    this.component = element.component;
    this.component[ELEMENT_REF] = this;
    this.rendered = element.rendered;
  }

  updateTree(scheduler, parent) {
    this.scheduler = scheduler;

    const component = this.getComponent();
    const nextState = this.nextState ?? component.state;

    if (this.rendered && !component.shouldComponentUpdate(this.props, nextState)) {
      return;
    }

    component.props = this.props;
    component.state = nextState;

    const oldRendered = this.rendered;
    const newRendered = (this.rendered = new Rendered(component.render()));

    newRendered.owner = this;
    newRendered.parent = parent;

    const oldChildren = oldRendered?.element.props.children;
    const newChildren = newRendered.element.props.children;
    lockstepArr(oldChildren, newChildren, (oldChild, newChild) => {
      newChild?.persistFrom(oldChild);
      newChild?.updateTree(scheduler, this);
    });
  }

  receiveState(nextState) {
    this.nextState = nextState;
    this.scheduler.computeNextUpdateOnceThisFrame();
  }
}
