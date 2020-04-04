import { LocalRenderer } from "./jsui-reconciler";
import { Root } from "./jsui-root";

export default class JsUIDOM {
  static render(element, host, cb = () => {}) {
    const opaqueShadowRoot = host.attachOpaqueShadow();
    const jsuiRoot = new Root(LocalRenderer, element, opaqueShadowRoot);
    jsuiRoot.once("uploaded", cb);
    jsuiRoot.computeNextUpdate();
  }
}
