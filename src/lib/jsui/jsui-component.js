import assert from "assert";

import { ELEMENT_REF, NEXT_STATE } from "./jsui-element";

export class Component {
  props = {};
  state = null;
  [NEXT_STATE] = null;
  [ELEMENT_REF] = null;

  componentDidMount() {
    // noop
  }

  shouldComponentUpdate() {
    return true;
  }

  setState(nextState) {
    this[NEXT_STATE] = nextState;
    this[ELEMENT_REF].scheduler.computeUpdateNextFrame();
  }

  render() {
    assert.fail();
  }
}
