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

export const getRealAttributeName = name => {
  return ATTRIBUTE_MAP[name] ?? name;
};

export const isValidAttribute = (tag, name) => {
  return ATTRIBUTE_SETS["*"].has(name) || ATTRIBUTE_SETS[tag].has(name);
};
