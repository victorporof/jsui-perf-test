import { getRealAttributeName, isValidAttribute } from "./jsui-attributes";
import { diff } from "./jsui-diff";
import { DOMFragment, DOMNode, DOMText } from "./jsui-primitive";
import { DOMPrint, HTMLPrint } from "./jsui-printers";
import { ADDED_FRAGMENT, ADDED_NODE, ADDED_TEXT, DEL_ATRR, SET_ATTR, SET_TEXT } from "./polyfill";

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
    await host.render(update.changelist);

    for (const rendered of update.mountlist) {
      rendered.owner.component.componentDidMount();
    }
  }

  static onAdded = (changelist, mountlist, rendered, parentRendered) => {
    if (rendered.element.type == DOMFragment) {
      this.onAddedFragment(changelist, rendered, parentRendered);
    } else if (rendered.element.type == DOMText) {
      this.onAddedText(changelist, rendered, parentRendered);
    } else if (rendered.element.type == DOMNode) {
      this.onAddedNode(changelist, rendered, parentRendered);
    }
    mountlist.push(rendered);
  };

  static onAddedFragment = (changelist, rendered, parentRendered) => {
    const uid = rendered.owner.component.uid;
    const parentUid = parentRendered?.owner.component.uid;

    changelist.push([ADDED_FRAGMENT, uid, parentUid]);
  };

  static onAddedText = (changelist, rendered, parentRendered) => {
    const uid = rendered.owner.component.uid;
    const parentUid = parentRendered?.owner.component.uid;

    const value = rendered.element.meta.value;
    changelist.push([ADDED_TEXT, value, uid, parentUid]);
  };

  static onAddedNode = (changelist, rendered, parentRendered) => {
    const uid = rendered.owner.component.uid;
    const parentUid = parentRendered?.owner.component.uid;

    const type = rendered.element.meta.tag;
    const props = rendered.element.props;
    changelist.push([ADDED_NODE, type, props, uid, parentUid]);
  };

  static onRemoved = () => {
    // TODO
  };

  static onSetText = (changelist, rendered, value) => {
    changelist.push([SET_TEXT, rendered.owner.component.uid, value]);
  };

  static onSetAttribute = (changelist, rendered, name, value) => {
    if (!isValidAttribute(rendered.element.meta.tag, name)) {
      return;
    }
    const key = getRealAttributeName(name);
    changelist.push([SET_ATTR, rendered.owner.component.uid, key, value]);
  };

  static onRemovedAttribute = (changelist, rendered, name) => {
    if (!isValidAttribute(rendered.element.meta.tag, name)) {
      return;
    }
    const key = getRealAttributeName(name);
    changelist.push([DEL_ATRR, rendered.owner.component.uid, key]);
  };
}
