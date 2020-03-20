import { CHANGE_TYPE, PRIVATE_SUBTREE } from "../polyfill";

import { gatherAttributes } from "./jsui-attributes";
import { DOMNode, TextLeaf } from "./jsui-primitive";
import { DOMPrint, HTMLPrint } from "./jsui-printers";

export class BaseReconciler {
  begin() {
    this.changelist = [];
    this.mountlist = [];
    return this;
  }

  end() {
    return {
      changelist: this.changelist,
      mountlist: this.mountlist
    };
  }

  upload(element, host, update) {
    for (const component of update.mountlist) {
      component.componentDidMount();
    }
  }

  onInstantiated = element => {
    if (element.isUserComponent()) {
      this.mountlist.push(element.component);
    }
  };

  onAdded = (element, parentElement) => {};
  onAddedText = (element, parentElement) => {};
  onAddedNode = (element, parentElement) => {};
  onRemoved = () => {};
  onSetText = (element, textContent) => {};
  onSetAttribute = (element, name, value) => {};
  onRemovedAttribute = () => {};
}

export class DOMReplaceReconciler extends BaseReconciler {
  upload(element, host, update) {
    DOMPrint.printInto(element, host[PRIVATE_SUBTREE]);
    super.upload(element, host, update);
  }
}

export class InnerHTMLReplaceReconciler extends BaseReconciler {
  upload(element, host, update) {
    HTMLPrint.printInto(element, host[PRIVATE_SUBTREE]);
    super.upload(element, host, update);
  }
}

export class DiffingReconciler extends BaseReconciler {
  upload(element, host, update) {
    host.render(update.changelist);
    super.upload(element, host, update);
  }

  onAdded = (element, parentElement) => {
    if (element.type == TextLeaf) {
      this.onAddedText(element, parentElement);
    } else if (element.type == DOMNode) {
      this.onAddedNode(element, parentElement);
    }
  };

  onAddedText = (element, parentElement) => {
    const id = element.uid;
    const parentId = parentElement?.uid;
    const textContent = element.meta.value;
    this.changelist.push(
      { type: CHANGE_TYPE.CREATE_TEXT_NODE, id, textContent },
      { type: CHANGE_TYPE.APPEND, id, parentId }
    );
  };

  onAddedNode = (element, parentElement) => {
    const id = element.uid;
    const parentId = parentElement?.uid;
    const tagName = element.meta.tag;
    const attributes = gatherAttributes(tagName, element.props);
    this.changelist.push(
      { type: CHANGE_TYPE.CREATE_ELEMENT, id, tagName },
      { type: CHANGE_TYPE.SET_ATTRIBUTE, id, attributes },
      { type: CHANGE_TYPE.APPEND, id, parentId }
    );
  };

  onRemoved = () => {
    // TODO
  };

  onSetText = (element, textContent) => {
    const id = element.uid;
    this.changelist.push({ type: CHANGE_TYPE.SET_TEXT_CONTENT, id, textContent });
  };

  onSetAttribute = (element, name, value) => {
    const id = element.uid;
    const attributes = gatherAttributes(element.meta.tag, element.props);
    this.changelist.push({ type: CHANGE_TYPE.SET_ATTRIBUTE, id, attributes });
  };

  onRemovedAttribute = () => {
    // TODO
  };
}
