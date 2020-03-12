import { ATTRIBUTE_MAP, ATTRIBUTE_SETS } from "./jsui-attributes";
import { diff } from "./jsui-diff";
import { Fragment } from "./jsui-primitive";
import { DOMPrint, DOMPrintShallow, HTMLPrint } from "./jsui-printers";

export class DOMReplaceReconciler {
  static reconcile(oldElement, newElement, host) {
    DOMPrint.printInto(newElement, host);
  }
}

export class InnerHTMLReplaceReconciler {
  static reconcile(oldElement, newElement, host) {
    HTMLPrint.printInto(newElement, host);
  }
}

export class DiffingReconciler {
  static reconcile(oldElement, newElement, host) {
    diff(oldElement, newElement, {
      onAdded: (element, parent) => this.onAdded(element, parent, host),
      onRemove: this.onRemove,
      onSetText: this.onSetText,
      onSetAttribute: this.onSetAttribute,
      onRemoveAtrribute: this.onRemoveAtrribute
    });
  }

  static onAdded(element, parent, host) {
    const node = DOMPrintShallow.toDOM(element);
    const parentNode = parent?.dom ?? host;
    parentNode.appendChild(node);

    if (element.type == Fragment) {
      element.dom = parentNode;
    } else {
      element.dom = parentNode.lastChild;
    }
  }

  static onRemove() {
    // TODO
  }

  static onSetText(element, value) {
    element.dom.nodeValue = value;
  }

  static onSetAttribute(element, name, value) {
    if (!ATTRIBUTE_SETS["*"].has(name) && !ATTRIBUTE_SETS[element.meta.tag].has(name)) {
      return;
    }
    const key = ATTRIBUTE_MAP[name] ?? name;
    element.dom.setAttribute(key, value);
  }

  static onRemovedAttribute(element, name) {
    element.dom.removeAttribute(ATTRIBUTE_MAP[name] ?? name);
  }
}
