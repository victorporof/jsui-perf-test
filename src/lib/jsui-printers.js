import { ATTRIBUTE_MAP, ATTRIBUTE_SETS } from "./jsui-attributes";
import { DOMNode, Fragment, Text } from "./jsui-primitive";

export class DOMPrintShallow {
  static toDOM(element, host = new DocumentFragment()) {
    if (element.type == DOMNode) {
      DOMPrint.appendNode(element, host);
    } else if (element.type == Text) {
      DOMPrint.appendText(element, host);
    }
    return host;
  }
}

export class DOMPrint {
  static printInto(element, host) {
    while (host.firstChild) {
      host.removeChild(host.firstChild);
    }
    host.appendChild(this.toDOM(element));
  }

  static toDOM(element, host = new DocumentFragment()) {
    if (element.type == DOMNode) {
      this.appendNodeDeep(element, host);
    } else if (element.type == Fragment) {
      this.appendChildren(element, host);
    } else if (element.type == Text) {
      this.appendText(element, host);
    }
    return host;
  }

  static appendText(element, host) {
    const node = document.createTextNode(element.meta.value);
    host.appendChild(node);
  }

  static appendChildren(element, host) {
    for (const child of element.props.children) {
      this.toDOM(child.rendered, host);
    }
  }

  static appendNode(element, host) {
    const node = document.createElement(element.meta.tag);
    for (const [name, value] of Object.entries(element.props ?? {})) {
      if (!ATTRIBUTE_SETS["*"].has(name) && !ATTRIBUTE_SETS[element.meta.tag].has(name)) {
        continue;
      }
      const key = ATTRIBUTE_MAP[name] ?? name;
      node.setAttribute(key, value ?? "");
    }
    host.appendChild(node);
    return node;
  }

  static appendNodeDeep(element, host) {
    const node = this.appendNode(element, host);
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
      if (!ATTRIBUTE_SETS["*"].has(name) && !ATTRIBUTE_SETS[element.meta.tag].has(name)) {
        continue;
      }
      const key = ATTRIBUTE_MAP[name] ?? name;
      tokens.push(` ${key}="${value ?? ""}"`);
    }
    tokens.push(`>`);
    this.appendChildren(element, tokens);
    tokens.push(`</${element.meta.tag}>`);
  }
}
