import { Text } from "./jsui-primitive";
import { lockstep, lockstepObj } from "./jsui-util";

export const diff = (oldElement, newElement, listeners, parentElement = null) => {
  if (oldElement == newElement) {
    return;
  }

  if (oldElement == null) {
    listeners.onAdded(newElement, parentElement);
  } else if (newElement == null) {
    // TODO
  } else if (oldElement.type != newElement.type) {
    // TODO
  } else if (newElement.type == Text) {
    const prevTextValue = oldElement.meta.value;
    const nextTextValue = newElement.meta.value;
    if (prevTextValue != nextTextValue) {
      listeners.onSetText(newElement, nextTextValue);
    }
  } else {
    lockstepObj(oldElement.props, newElement.props, (prevProp, nextProp) => {
      const [prevName, prevValue] = prevProp;
      const [nextName, nextValue] = nextProp;
      if (prevName != nextName) {
        listeners.onRemovedAtrribute(newElement, prevName);
        listeners.onSetAttribute(newElement, nextName, nextValue);
      } else if (prevValue != nextValue) {
        listeners.onSetAttribute(newElement, nextName, nextValue);
      }
    });
  }

  lockstep(oldElement?.props.children, newElement?.props.children, (oldChild, newChild) => {
    diff(oldChild?.rendered, newChild?.rendered, listeners, newElement);
  });
};
