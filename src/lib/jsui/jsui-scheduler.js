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

    const [update, cb] = this.pending.pop() ?? [];
    if (update) {
      Reconciler.upload(this.host, update);
      cb?.();
    }
  };

  computeNextUpdate(cb) {
    const prevTree = this.element.rendered;
    this.element.updateTree(this);
    const nextTree = this.element.rendered;
    this.pending.push([Reconciler.diff(prevTree, nextTree), cb]);
  }

  computeNextUpdateOnceWhenIdle = justOnceWhenIdle(() => {
    this.computeNextUpdate();
  });

  computeNextUpdateOnceThisFrame = justOnceUntilNextFrame(() => {
    this.computeNextUpdate();
  });
}
