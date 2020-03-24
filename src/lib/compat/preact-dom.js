import PreactDOM from "../../../node_modules/preact/compat";
import { PRIVATE_SUBTREE } from "../polyfill";

const render = PreactDOM.render;

PreactDOM.render = (element, host, cb) => {
  const opaqueShadowRoot = host.attachOpaqueShadow();
  render.call(PreactDOM, element, opaqueShadowRoot[PRIVATE_SUBTREE], cb);
};

export default PreactDOM;
