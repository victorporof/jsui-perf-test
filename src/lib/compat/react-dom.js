import ReactDOM from "../../../node_modules/react-dom";
import { PRIVATE_SUBTREE } from "../polyfill";

const render = ReactDOM.render;

ReactDOM.render = (element, root, cb) => {
  render.call(ReactDOM, element, root[PRIVATE_SUBTREE], cb);
};

export default ReactDOM;
