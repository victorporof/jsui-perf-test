import { Component } from "./jsui-component";
import { ELEMENT_REF } from "./jsui-element";

export class InternalComponent extends Component {
  render() {
    return this[ELEMENT_REF];
  }
}

export class RootNode extends InternalComponent {}

export class DOMNodeOrFragment extends InternalComponent {}

export class DOMNode extends DOMNodeOrFragment {}

export class DOMFragment extends DOMNodeOrFragment {}

export class LeafNode extends InternalComponent {}

export class NullLeaf extends LeafNode {}

export class TextLeaf extends LeafNode {}
