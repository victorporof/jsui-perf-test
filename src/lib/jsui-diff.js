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
    lockstepObj(oldElement.props, newElement.props, (propName, prevValue, nextValue) => {
      if (propName == "children") {
        return;
      }
      if (nextValue === undefined) {
        listeners.onRemovedAtrribute(newElement, propName);
      } else if (prevValue != nextValue) {
        listeners.onSetAttribute(newElement, propName, nextValue);
      }
    });
  }

  lockstep(oldElement?.props.children, newElement?.props.children, (oldChild, newChild) => {
    diff(oldChild?.rendered, newChild?.rendered, listeners, newElement);
  });
};
