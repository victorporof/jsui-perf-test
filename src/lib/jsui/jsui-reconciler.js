import { CHANGE_TYPE, PRIVATE_SUBTREE } from "../polyfill";

import { gatherAttributes } from "./jsui-attributes";
import { DOMNode, TextLeaf } from "./jsui-primitive";
import { DOMPrint, HTMLPrint } from "./jsui-printers";

export class BaseReconciler {
  constructor(host) {
    this.host = host;
  }

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

  upload(element, update) {
    for (const component of update.mountlist) {
      component.componentDidMount();
    }
  }

  onInstantiated = element => {
    if (element.isUserComponent()) {
      this.mountlist.push(element.component);
    }
  };

  onAdded = (element, parentElement) => {
    // noop
  };

  onAddedText = (element, parentElement) => {
    // noop
  };

  onAddedNode = (element, parentElement) => {
    // noop
  };

  onRemoved = () => {
    // noop
  };

  onSetText = (element, textContent) => {
    // noop
  };

  onSetAttribute = (element, name, value) => {
    // noop
  };

  onRemovedAttribute = () => {
    // noop
  };
}

export class DOMReplaceReconciler extends BaseReconciler {
  upload(element, update, onUploaded) {
    DOMPrint.printInto(element, this.host[PRIVATE_SUBTREE]);
    super.upload(element, update);
    onUploaded?.();
  }
}

export class InnerHTMLReplaceReconciler extends BaseReconciler {
  upload(element, update, onUploaded) {
    HTMLPrint.printInto(element, this.host[PRIVATE_SUBTREE]);
    super.upload(element, update);
    onUploaded?.();
  }
}

export class BaseDiffingReconciler extends BaseReconciler {
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

export class LocalDiffingReconciler extends BaseDiffingReconciler {
  upload(element, update, onUploaded) {
    this.host.render(update.changelist);
    super.upload(element, update);
    onUploaded?.();
  }
}

export class RemoteDiffingReconciler extends BaseDiffingReconciler {
  constructor(host) {
    super(host);

    this.generation = 0;
    this.callbacks = new Map();
    window.addEventListener("message", this.onMessage, false);
  }

  upload(element, update, onUploaded) {
    this.callbacks.set(this.generation, onUploaded);

    this.host.contentWindow.postMessage(
      {
        type: "update",
        payload: {
          generation: this.generation,
          changelist: update.changelist
        }
      },
      "*"
    );

    this.generation++;
    super.upload(element, update);
  }

  onMessage = ({ data }) => {
    if (data.type != "work-started") {
      return;
    }
    for (const generation of data.payload.generations) {
      this.callbacks.get(generation)();
      this.callbacks.delete(generation);
    }
  };
}
