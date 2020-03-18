export const ADDED_TEXT = 2;
export const ADDED_NODE = 3;
export const REMOVED = 4;
export const SET_TEXT = 5;
export const SET_ATTR = 6;
export const DEL_ATRR = 7;

HTMLElement.prototype.prepare = function() {
  this.__nodes = new Map();
};

HTMLElement.prototype.render = function(changelist) {
  return new Promise((resolve, reject) => {
    for (const change of changelist) {
      const type = change[0];
      if (type == ADDED_TEXT) {
        onAddedText(this, change);
      } else if (type == ADDED_NODE) {
        onAddedNode(this, change);
      } else if (type == REMOVED) {
        // TODO
      } else if (type == SET_TEXT) {
        onSetText(this, change);
      } else if (type == SET_ATTR) {
        onSetAttribute(this, change);
      } else if (type == DEL_ATRR) {
        onRemovedAttribute(this, change);
      }
    }
    resolve();
  });
};

const onAddedText = (root, [, value, uid, parentUid]) => {
  const parent = root.__nodes.get(parentUid) ?? root;
  const node = document.createTextNode(value);
  parent.appendChild(node);
  root.__nodes.set(uid, node);
};

const onAddedNode = (root, [, tag, attributes, uid, parentUid]) => {
  const parent = root.__nodes.get(parentUid) ?? root;
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes ?? {})) {
    node.setAttribute(key, value ?? "");
  }
  parent.appendChild(node);
  root.__nodes.set(uid, node);
};

const onSetText = (root, [, uid, value]) => {
  const node = root.__nodes.get(uid);
  node.nodeValue = value;
};

const onSetAttribute = (root, [, uid, key, value]) => {
  const node = root.__nodes.get(uid);
  node.setAttribute(key, value);
};

const onRemovedAttribute = (root, [, uid, key]) => {
  const node = root.__nodes.get(uid);
  node.removeAttribute(key);
};
