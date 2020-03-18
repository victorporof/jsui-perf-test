export const CHANGE_TYPE = {
  CREATE_TEXT_NODE: "CreateTextNode",
  CREATE_ELEMENT: "CreateElement",
  APPEND: "Append",
  REMOVE: "Remove",
  SET_ATTRIBUTE: "SetAttribute",
  SET_TEXT_CONTENT: "SetTextContent"
};

HTMLElement.prototype.attachOpaqueShadow ||= function() {
  return new OpaqueShadowRoot(this);
};

class OpaqueShadowRoot {
  constructor(root) {
    this.root = root;
    this.nodes = new Map();
  }

  render(changelist) {
    for (const change of changelist) {
      const { type } = change;

      if (type == CHANGE_TYPE.CREATE_TEXT_NODE) {
        this.handleCreateTextNode(change);
      } else if (type == CHANGE_TYPE.CREATE_ELEMENT) {
        this.handleCreateElement(change);
      } else if (type == CHANGE_TYPE.APPEND) {
        this.handleAppend(change);
      } else if (type == CHANGE_TYPE.REMOVE) {
        // TODO
      } else if (type == CHANGE_TYPE.SET_ATTRIBUTE) {
        this.handleSetAttribute(change);
      } else if (type == CHANGE_TYPE.REMOVE_ATTRIBUTE) {
        // TODO
      } else if (type == CHANGE_TYPE.SET_TEXT_CONTENT) {
        this.handleSetTextContent(change);
      }
    }
  }

  handleCreateTextNode({ id, textContent }) {
    const node = document.createTextNode(textContent);
    this.nodes.set(id, node);
  }

  handleCreateElement({ id, tagName }) {
    const node = document.createElement(tagName);
    this.nodes.set(id, node);
  }

  handleAppend({ id, parentId }) {
    const parent = this.nodes.get(parentId) ?? this.root;
    const node = this.nodes.get(id);
    parent.appendChild(node);
  }

  handleSetTextContent({ id, textContent }) {
    const node = this.nodes.get(id);
    node.nodeValue = textContent;
  }

  handleSetAttribute({ id, attributes }) {
    const node = this.nodes.get(id);
    for (const [key, value] of Object.entries(attributes ?? {})) {
      node.setAttribute(key, value ?? "");
    }
  }
}
