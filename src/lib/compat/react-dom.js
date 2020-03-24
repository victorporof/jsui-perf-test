import ReactDOM from "../../../node_modules/react-dom";
import { PRIVATE_SUBTREE } from "../polyfill";

const render = ReactDOM.render;

ReactDOM.render = (element, host, cb) => {
  const opaqueShadowRoot = host.attachOpaqueShadow();
  render.call(ReactDOM, element, opaqueShadowRoot[PRIVATE_SUBTREE], cb);
};

export default ReactDOM;
