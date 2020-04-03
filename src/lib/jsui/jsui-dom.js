import { LocalDiffingReconciler } from "./jsui-reconciler";
import { Root } from "./jsui-root";

export default class JsUIDOM {
  static render(element, host, cb = () => {}) {
    const opaqueShadowRoot = host.attachOpaqueShadow();
    const jsuiRoot = new Root(LocalDiffingReconciler, element, opaqueShadowRoot);
    jsuiRoot.once("uploaded", cb);
    jsuiRoot.computeNextUpdate();
  }
}
