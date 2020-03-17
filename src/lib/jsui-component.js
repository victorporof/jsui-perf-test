import shortid from "shortid";

import { ELEMENT_REF } from "./jsui-element";

export class Component {
  props = {};

  constructor() {
    this.uid = shortid.generate();
  }

  componentDidMount() {
    // noop
  }

  shouldComponentUpdate() {
    return true;
  }

  setState(nextState) {
    this[ELEMENT_REF].receiveState(nextState);
  }
}
