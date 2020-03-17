import { getRealAttributeName, isValidAttribute } from "./jsui-attributes";
import { DOMFragment, DOMNode, DOMText } from "./jsui-primitive";

export class DOMPrint {
  static printInto(rendered, host) {
    while (host.firstChild) {
      host.removeChild(host.firstChild);
    }
    host.appendChild(this.toDOM(rendered));
  }

  static toDOM(rendered, host = document.createDocumentFragment()) {
    if (rendered.element.type == DOMFragment) {
      this.appendChildren(rendered, host);
    } else if (rendered.element.type == DOMText) {
      this.appendText(rendered, host);
    } else if (rendered.element.type == DOMNode) {
      this.appendNode(rendered, host);
    }
    return host;
  }

  static appendChildren(rendered, host) {
    for (const child of rendered.element.props.children) {
      this.toDOM(child.rendered, host);
    }
  }

  static createText(value) {
    return document.createTextNode(value);
  }

  static appendText(rendered, host) {
    const node = this.createText(rendered.element.meta.value);
    host.appendChild(node);
  }

  static createNode(tag, props) {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(props ?? {})) {
      if (!isValidAttribute(tag, name)) {
        continue;
      }
      const key = getRealAttributeName(name);
      node.setAttribute(key, value ?? "");
    }
    return node;
  }

  static appendNode(rendered, host) {
    const node = this.createNode(rendered.element.meta.tag, rendered.element.props, host);
    host.appendChild(node);
    this.appendChildren(rendered, node);
  }
}

export class HTMLPrint {
  static printInto(rendered, host) {
    host.innerHTML = this.toHTML(rendered);
  }

  static toHTML(rendered, tokens = []) {
    return this.toTokens(rendered, tokens).join("");
  }

  static toTokens(rendered, tokens = []) {
    if (rendered.element.type == DOMFragment) {
      this.appendChildren(rendered, tokens);
    } else if (rendered.element.type == DOMText) {
      this.appendText(rendered, tokens);
    } else if (rendered.element.type == DOMNode) {
      this.appendNode(rendered, tokens);
    }
    return tokens;
  }

  static appendChildren(rendered, tokens) {
    for (const child of rendered.element.props.children) {
      this.toTokens(child.rendered, tokens);
    }
  }

  static appendText(rendered, tokens) {
    tokens.push(rendered.element.meta.value);
  }

  static appendNode(rendered, tokens) {
    tokens.push(`<${rendered.element.meta.tag}`);
    for (const [name, value] of Object.entries(rendered.element.props ?? {})) {
      if (!isValidAttribute(rendered.element.meta.tag, name)) {
        continue;
      }
      const key = getRealAttributeName(name);
      tokens.push(` ${key}="${value ?? ""}"`);
    }
    tokens.push(`>`);
    this.appendChildren(rendered, tokens);
    tokens.push(`</${rendered.element.meta.tag}>`);
  }
}
