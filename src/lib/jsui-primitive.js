import { Component } from "./jsui-component";
import { ELEMENT_REF } from "./jsui-element";

export class Primitive extends Component {
  render() {
    return this[ELEMENT_REF];
  }
}

export class Nil extends Primitive {}

export class DOMFragment extends Primitive {}

export class DOMText extends Primitive {}

export class DOMNode extends Primitive {}
