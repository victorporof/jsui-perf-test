import { DiffingReconciler as Reconciler } from "./jsui-reconciler";
import { justOnceUntilNextFrame, justOnceWhenIdle } from "./jsui-util";

export class Scheduler {
  constructor(element, host) {
    this.element = element;
    this.host = host;
    this.pending = [];
    requestAnimationFrame(this.onAnimationFrame);
  }

  onAnimationFrame = () => {
    requestAnimationFrame(this.onAnimationFrame);

    const update = this.pending.pop();
    if (update) {
      Reconciler.upload(this.host, update);
    }
  };

  computeNextUpdate() {
    const prevTree = this.element.rendered;
    this.element.updateTree(this);
    const nextTree = this.element.rendered;
    this.pending.push(Reconciler.diff(prevTree, nextTree));
  }

  computeNextUpdateOnceWhenIdle = justOnceWhenIdle(() => {
    this.computeNextUpdate();
  });

  computeNextUpdateOnceThisFrame = justOnceUntilNextFrame(() => {
    this.computeNextUpdate();
  });
}
