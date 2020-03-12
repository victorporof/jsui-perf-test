import { Component } from "./jsui-component";
import { ELEMENT } from "./jsui-element";

export class Primitive extends Component {
  render() {
    return this[ELEMENT];
  }
}

export class Nil extends Primitive {}

export class Text extends Primitive {}

export class Fragment extends Primitive {}

export class DOMNode extends Primitive {}
