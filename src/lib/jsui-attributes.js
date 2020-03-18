import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";
import attr from "react-html-attributes";

const ATTRIBUTES = ["*", ...attr.elements.html].map(tag => ({
  key: tag,
  values: new Set(attr[tag])
}));

const ATTRIBUTE_SETS = mapValues(keyBy(ATTRIBUTES, "key"), "values");

const ATTRIBUTE_MAP = {
  className: "class"
};

export const getRealAttributeKey = name => {
  return ATTRIBUTE_MAP[name] ?? name;
};

export const isValidAttribute = (tag, name) => {
  return ATTRIBUTE_SETS["*"].has(name) || ATTRIBUTE_SETS[tag].has(name);
};

export const withValidRealAttribute = (tag, name, cb) => {
  if (isValidAttribute(tag, name)) {
    cb(getRealAttributeKey(name));
  }
};

export const gatherValidRealAttributes = (tag, props, store = {}) => {
  for (const [name, value] of Object.entries(props ?? {})) {
    withValidRealAttribute(tag, name, key => (store[key] = value ?? ""));
  }
  return store;
};
