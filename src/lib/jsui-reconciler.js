import { getRealAttributeName, isValidAttribute } from "./jsui-attributes";
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
      onRemoved: this.onRemoved,
      onSetText: this.onSetText,
      onSetAttribute: this.onSetAttribute,
      onRemoveAtrribute: this.onRemoveAtrribute
    });
  }

  static onAdded(element, parent, host) {
    const parentNode = parent?.dom ?? host;

    if (element.type == Fragment) {
      element.didMount(parentNode);
    } else {
      const node = DOMPrintShallow.toDOM(element);
      parentNode.appendChild(node);
      element.didMount(node);
    }
  }

  static onRemoved() {
    // TODO
  }

  static onSetText(element, value) {
    element.dom.nodeValue = value;
  }

  static onSetAttribute(element, name, value) {
    if (!isValidAttribute(element.meta.tag, name)) {
      return;
    }
    const key = getRealAttributeName(name);
    element.dom.setAttribute(key, value);
  }

  static onRemovedAttribute(element, name) {
    const key = getRealAttributeName(name);
    element.dom.removeAttribute(key ?? name);
  }
}
