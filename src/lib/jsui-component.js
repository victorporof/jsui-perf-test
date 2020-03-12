import { ELEMENT } from "./jsui-element";

export class Component {
  props = {};

  componentDidMount() {
    // noop
  }

  shouldComponentUpdate() {
    return true;
  }

  setState(nextState) {
    this[ELEMENT].receiveState(nextState);
  }
}
