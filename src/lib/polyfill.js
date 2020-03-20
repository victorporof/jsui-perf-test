export const CHANGE_TYPE = {
  CREATE_TEXT_NODE: "CreateTextNode",
  CREATE_ELEMENT: "CreateElement",
  APPEND: "Append",
  REMOVE: "Remove",
  SET_ATTRIBUTE: "SetAttribute",
  SET_TEXT_CONTENT: "SetTextContent"
};

export const PRIVATE_SUBTREE = Symbol("OpaqueShadowRoot Private Subtree");
export const PRIVATE_NODES = Symbol("OpaqueShadowRoot Private Nodes");

HTMLElement.prototype.attachOpaqueShadow ||= function() {
  if (this.opaqueShadowRoot) {
    throw new DOMException("Failed to execute 'attachOpaqueShadow' on 'Element'.");
  }
  return (this.opaqueShadowRoot = new window.OpaqueShadowRoot(this));
};

window.OpaqueShadowRoot ||= class {
  constructor(host) {
    this[PRIVATE_SUBTREE] = host.attachShadow({ mode: "closed" });
    this[PRIVATE_NODES] = new Map();
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
    this[PRIVATE_NODES].set(id, node);
  }

  handleCreateElement({ id, tagName }) {
    const node = document.createElement(tagName);
    this[PRIVATE_NODES].set(id, node);
  }

  handleAppend({ id, parentId }) {
    const parent = this[PRIVATE_NODES].get(parentId) ?? this[PRIVATE_SUBTREE];
    const node = this[PRIVATE_NODES].get(id);
    parent.appendChild(node);
  }

  handleSetTextContent({ id, textContent }) {
    const node = this[PRIVATE_NODES].get(id);
    node.nodeValue = textContent;
  }

  handleSetAttribute({ id, attributes }) {
    const node = this[PRIVATE_NODES].get(id);
    for (const [key, value] of Object.entries(attributes ?? {})) {
      node.setAttribute(key, value ?? "");
    }
  }
};
