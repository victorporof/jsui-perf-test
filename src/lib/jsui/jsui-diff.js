import { DOMText } from "./jsui-primitive";
import { lockstepArr, lockstepObj } from "./jsui-util";

export const diff = (
  oldRendered,
  newRendered,
  parentRendered,
  changelist,
  mountlist,
  callbacks
) => {
  if (oldRendered == newRendered) {
    return;
  }
  if (oldRendered == null) {
    whenAdded(newRendered, parentRendered?.nonFragmentRendered, changelist, mountlist, callbacks);
    checkChildrenChanged(oldRendered, newRendered, changelist, mountlist, callbacks);
  } else if (newRendered == null) {
    // TODO
  } else if (oldRendered.element.type != newRendered.element.type) {
    // TODO
  } else if (newRendered.element.type == DOMText) {
    whenTextChanged(oldRendered, newRendered, changelist, callbacks);
  } else {
    checkAttrChanged(oldRendered, newRendered, changelist, callbacks);
    checkChildrenChanged(oldRendered, newRendered, changelist, mountlist, callbacks);
  }
};

const whenAdded = (newRendered, parentRendered, changelist, mountlist, callbacks) => {
  callbacks.onAdded(changelist, mountlist, newRendered, parentRendered);
};

const whenTextChanged = (oldRendered, newRendered, changelist, callbacks) => {
  const prevTextValue = oldRendered.element.meta.value;
  const nextTextValue = newRendered.element.meta.value;
  if (prevTextValue != nextTextValue) {
    callbacks.onSetText(changelist, newRendered, nextTextValue);
  }
};

const checkAttrChanged = (oldRendered, newRendered, changelist, callbacks) => {
  const prevProps = oldRendered.element.props;
  const nextProps = newRendered.element.props;
  lockstepObj(prevProps, nextProps, (propName, prevValue, nextValue) => {
    if (propName == "children") {
      return;
    }
    if (nextValue === undefined) {
      // TODO
    } else if (prevValue != nextValue) {
      callbacks.onSetAttribute(changelist, newRendered, propName, nextValue);
    }
  });
};

const checkChildrenChanged = (oldRendered, newRendered, changelist, mountlist, callbacks) => {
  const oldChildren = oldRendered?.element.props.children;
  const newChildren = newRendered.element.props.children;
  lockstepArr(oldChildren, newChildren, (oldChild, newChild) => {
    diff(oldChild?.rendered, newChild?.rendered, newRendered, changelist, mountlist, callbacks);
  });
};
