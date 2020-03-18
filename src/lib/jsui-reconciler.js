import { gatherValidRealAttributes } from "./jsui-attributes";
import { diff } from "./jsui-diff";
import { DOMNode, DOMText } from "./jsui-primitive";
import { DOMPrint, HTMLPrint } from "./jsui-printers";
import { CHANGE_TYPE } from "./polyfill";

export class DOMReplaceReconciler {
  static reconcile(oldRendered, newRendered, host) {
    DOMPrint.printInto(newRendered, host);
  }
}

export class InnerHTMLReplaceReconciler {
  static reconcile(oldRendered, newRendered, host) {
    HTMLPrint.printInto(newRendered, host);
  }
}

export class DiffingReconciler {
  static diff(oldRendered, newRendered) {
    const changelist = [];
    const mountlist = [];

    diff(oldRendered, newRendered, null, changelist, mountlist, {
      onAdded: this.onAdded,
      onRemoved: this.onRemoved,
      onSetText: this.onSetText,
      onSetAttribute: this.onSetAttribute,
      onRemovedAttribute: this.onRemovedAttribute
    });

    return { changelist, mountlist };
  }

  static async upload(host, update) {
    host.render(update.changelist);

    for (const rendered of update.mountlist) {
      rendered.owner.component.componentDidMount();
    }
  }

  static onAdded = (changelist, mountlist, rendered, parentRendered) => {
    if (rendered.element.type == DOMText) {
      this.onAddedText(changelist, rendered, parentRendered);
    } else if (rendered.element.type == DOMNode) {
      this.onAddedNode(changelist, rendered, parentRendered);
    }
    mountlist.push(rendered);
  };

  static onAddedText = (changelist, rendered, parentRendered) => {
    const id = rendered.owner.component.uid;
    const parentId = parentRendered?.owner.component.uid;
    const textContent = rendered.element.meta.value;
    changelist.push(
      { type: CHANGE_TYPE.CREATE_TEXT_NODE, id, textContent },
      { type: CHANGE_TYPE.APPEND, id, parentId }
    );
  };

  static onAddedNode = (changelist, rendered, parentRendered) => {
    const id = rendered.owner.component.uid;
    const parentId = parentRendered?.owner.component.uid;
    const tagName = rendered.element.meta.tag;
    const attributes = gatherValidRealAttributes(tagName, rendered.element.props);
    changelist.push(
      { type: CHANGE_TYPE.CREATE_ELEMENT, id, tagName },
      { type: CHANGE_TYPE.SET_ATTRIBUTE, id, attributes },
      { type: CHANGE_TYPE.APPEND, id, parentId }
    );
  };

  static onRemoved = () => {
    // TODO
  };

  static onSetText = (changelist, rendered, textContent) => {
    const id = rendered.owner.component.uid;
    changelist.push({ type: CHANGE_TYPE.SET_TEXT_CONTENT, id, textContent });
  };

  static onSetAttribute = (changelist, rendered, name, value) => {
    const id = rendered.owner.component.uid;
    const attributes = gatherValidRealAttributes(rendered.element.meta.tag, rendered.element.props);
    changelist.push({ type: CHANGE_TYPE.SET_ATTRIBUTE, id, attributes });
  };

  static onRemovedAttribute = () => {
    // TODO
  };
}
