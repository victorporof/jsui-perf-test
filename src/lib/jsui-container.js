import { DiffingReconciler as Reconciler } from "./jsui-reconciler";
import { oncePerAnimationFrame } from "./jsui-util";

export class Container {
  constructor(element, host) {
    this.element = element;
    this.host = host;
  }

  flushTreeIntoHost() {
    const prevTree = this.element.rendered;
    this.element.updateTreeIn(this);
    const nextTree = this.element.rendered;
    Reconciler.reconcile(prevTree, nextTree, this.host);
  }

  flushTreeWhenPossible = oncePerAnimationFrame(() => {
    this.flushTreeIntoHost();
  });
}
