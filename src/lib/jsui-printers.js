import { getRealAttributeName, isValidAttribute } from "./jsui-attributes";
import { DOMNode, Fragment, Text } from "./jsui-primitive";

export class DOMPrintShallow {
  static toDOM(element) {
    if (element.type == DOMNode) {
      return DOMPrint.createNode(element);
    }
    if (element.type == Text) {
      return DOMPrint.createText(element);
    }
    return null;
  }
}

export class DOMPrint {
  static printInto(element, host) {
    while (host.firstChild) {
      host.removeChild(host.firstChild);
    }
    host.appendChild(this.toDOM(element));
  }

  static toDOM(element, host = document.createDocumentFragment()) {
    if (element.type == DOMNode) {
      this.appendNodeDeep(element, host);
    } else if (element.type == Fragment) {
      this.appendChildren(element, host);
    } else if (element.type == Text) {
      this.appendText(element, host);
    }
    return host;
  }

  static createText(element) {
    return document.createTextNode(element.meta.value);
  }

  static appendText(element, host) {
    const node = this.createText(element);
    host.appendChild(node);
  }

  static appendChildren(element, host) {
    for (const child of element.props.children) {
      this.toDOM(child.rendered, host);
    }
  }

  static createNode(element) {
    const node = document.createElement(element.meta.tag);
    for (const [name, value] of Object.entries(element.props ?? {})) {
      if (!isValidAttribute(element.meta.tag, name)) {
        continue;
      }
      const key = getRealAttributeName(name);
      node.setAttribute(key, value ?? "");
    }
    return node;
  }

  static appendNodeDeep(element, host) {
    const node = this.createNode(element, host);
    host.appendChild(node);
    this.appendChildren(element, node);
  }
}

export class HTMLPrint {
  static printInto(element, host) {
    host.innerHTML = this.toHTML(element);
  }

  static toHTML(element, tokens = []) {
    return this.toTokens(element, tokens).join("");
  }

  static toTokens(element, tokens = []) {
    if (element.type == DOMNode) {
      this.appendNodeDeep(element, tokens);
    } else if (element.type == Fragment) {
      this.appendChildren(element, tokens);
    } else if (element.type == Text) {
      this.appendText(element, tokens);
    }
    return tokens;
  }

  static appendText(element, tokens) {
    tokens.push(element.meta.value);
  }

  static appendChildren(element, tokens) {
    for (const child of element.props.children) {
      this.toTokens(child.rendered, tokens);
    }
  }

  static appendNodeDeep(element, tokens) {
    tokens.push(`<${element.meta.tag}`);
    for (const [name, value] of Object.entries(element.props ?? {})) {
      if (!isValidAttribute(element.meta.tag, name)) {
        continue;
      }
      const key = getRealAttributeName(name);
      tokens.push(` ${key}="${value ?? ""}"`);
    }
    tokens.push(`>`);
    this.appendChildren(element, tokens);
    tokens.push(`</${element.meta.tag}>`);
  }
}
