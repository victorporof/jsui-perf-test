import assert from "assert";

import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";
import attr from "react-html-attributes";

const ATTRIBUTES = ["*", ...attr.elements.html].map((tag) => ({
  key: tag,
  values: new Set(attr[tag]),
}));

const ATTRIBUTE_SETS = mapValues(keyBy(ATTRIBUTES, "key"), "values");

const ATTRIBUTE_MAP = {
  className: "class",
};

export const getRealAttributeKey = (name) => {
  return ATTRIBUTE_MAP[name] ?? name;
};

export const isValidAttributeName = (tag, name) => {
  return ATTRIBUTE_SETS["*"].has(name) || ATTRIBUTE_SETS[tag].has(name);
};

export const gatherAttributes = (tag, props, store = {}) => {
  assert(props);

  for (const name in props) {
    if (isValidAttributeName(tag, name)) {
      const key = getRealAttributeKey(name);
      const value = props[name];
      store[key] = value ?? "";
    }
  }

  return store;
};
