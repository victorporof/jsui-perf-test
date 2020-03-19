import PreactDOM from "../../../node_modules/preact/compat";
import { PRIVATE_SUBTREE } from "../polyfill";

const render = PreactDOM.render;

PreactDOM.render = (element, root, cb) => {
  render.call(PreactDOM, element, root[PRIVATE_SUBTREE], cb);
};

export default PreactDOM;
