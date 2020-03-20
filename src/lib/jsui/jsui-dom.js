import { Element } from "./jsui-element";
import { Root } from "./jsui-root";

export default class JsUIDOM {
  static render(element, host, cb = () => {}) {
    const root = new Root(Element.sanitize(element), host);
    root.once("uploaded", cb);
    root.computeNextUpdate();
  }
}
