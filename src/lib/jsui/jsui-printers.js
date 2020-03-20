import { gatherAttributes } from "./jsui-attributes";
import { DOMFragment, DOMNode, TextLeaf } from "./jsui-primitive";

export class DOMPrint {
  static printInto(element, host) {
    const node = this.toDOM(element);
    if (host.firstChild) {
      host.replaceChild(node, host.firstChild);
    } else {
      host.appendChild(node);
    }
  }

  static toDOM(element, host = document.createDocumentFragment()) {
    if (element.type == TextLeaf) {
      this.appendText(element, host);
    } else if (element.type == DOMNode) {
      this.appendNode(element, host);
    } else if (element.type == DOMFragment) {
      this.appendChildren(element, host);
    } else {
      this.toDOM(element.rendered, host);
    }
    return host;
  }

  static appendText(element, host) {
    const node = document.createTextNode(element.meta.value);
    host.appendChild(node);
  }

  static appendNode(element, host) {
    const tag = element.meta.tag;
    const props = element.props;
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(gatherAttributes(tag, props))) {
      node.setAttribute(key, value ?? "");
    }
    host.appendChild(node);
    this.appendChildren(element, node);
  }

  static appendChildren(element, host) {
    for (const child of element.props.children) {
      this.toDOM(child, host);
    }
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
    if (element.type == TextLeaf) {
      this.appendText(element, tokens);
    } else if (element.type == DOMNode) {
      this.appendNode(element, tokens);
    } else if (element.type == DOMFragment) {
      this.appendChildren(element, tokens);
    } else {
      this.toTokens(element.rendered, tokens);
    }
    return tokens;
  }

  static appendText(element, tokens) {
    tokens.push(element.meta.value);
  }

  static appendNode(element, tokens) {
    const tag = element.meta.tag;
    const props = element.props;
    tokens.push(`<${tag}`);
    for (const [key, value] of Object.entries(gatherAttributes(tag, props))) {
      tokens.push(` ${key}="${value ?? ""}"`);
    }
    tokens.push(`>`);
    this.appendChildren(element, tokens);
    tokens.push(`</${tag}>`);
  }

  static appendChildren(element, tokens) {
    for (const child of element.props.children) {
      this.toTokens(child, tokens);
    }
  }
}
