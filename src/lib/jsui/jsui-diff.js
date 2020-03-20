import { DOMNode, TextLeaf } from "./jsui-primitive";
import { lockstepObj } from "./jsui-util";

export const shallowDiff = (prevElement, nextElement, parentElement, callbacks) => {
  if (prevElement == null) {
    whenAdded(nextElement, parentElement, callbacks);
  } else if (nextElement == null) {
    // TODO
  } else if (prevElement.type != nextElement.type) {
    // TODO
  } else if (nextElement.type == TextLeaf) {
    checkTextChanged(prevElement, nextElement, callbacks);
  } else if (nextElement.type == DOMNode) {
    checkNodeChanged(prevElement, nextElement, callbacks);
  }
};

const whenAdded = (element, parentElement, callbacks) => {
  if (element.type == DOMNode || element.type == TextLeaf) {
    callbacks.onAdded(element, parentElement);
  }
};

const checkTextChanged = (prevElement, nextElement, callbacks) => {
  const prevTextValue = prevElement.meta.value;
  const nextTextValue = nextElement.meta.value;
  if (prevTextValue != nextTextValue) {
    callbacks.onSetText(nextElement, nextTextValue);
  }
};

const checkNodeChanged = (prevElement, nextElement, callbacks) => {
  const prevProps = prevElement.props;
  const nextProps = nextElement.props;
  lockstepObj(prevProps, nextProps, (propName, prevValue, nextValue) => {
    if (propName == "children") {
      return;
    }
    if (nextValue === undefined) {
      // TODO
    } else if (prevValue != nextValue) {
      callbacks.onSetAttribute(nextElement, propName, nextValue);
    }
  });
};
