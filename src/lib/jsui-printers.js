import { gatherValidRealAttributes } from "./jsui-attributes";
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

  static appendText(rendered, host) {
    const node = document.createTextNode(rendered.element.meta.value);
    host.appendChild(node);
  }

  static appendNode(rendered, host) {
    const tag = rendered.element.meta.tag;
    const props = rendered.element.props;
    const node = document.createElement(tag);
    for (const [key, value] of gatherValidRealAttributes(tag, props)) {
      node.setAttribute(key, value ?? "");
    }
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
    const tag = rendered.element.meta.tag;
    const props = rendered.element.props;
    tokens.push(`<${tag}`);
    for (const [key, value] of gatherValidRealAttributes(tag, props)) {
      tokens.push(` ${key}="${value ?? ""}"`);
    }
    tokens.push(`>`);
    this.appendChildren(rendered, tokens);
    tokens.push(`</${tag}>`);
  }
}
