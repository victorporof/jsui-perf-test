import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";
import attr from "react-html-attributes";

export const ATTRIBUTES = ["*", ...attr.elements.html].map(tag => ({
  key: tag,
  values: new Set(attr[tag])
}));

export const ATTRIBUTE_SETS = mapValues(keyBy(ATTRIBUTES, "key"), "values");

export const ATTRIBUTE_MAP = {
  className: "class"
};
