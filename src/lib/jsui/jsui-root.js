import EventEmitter from "events";

import { Element } from "./jsui-element";
import { RootNode } from "./jsui-primitive";
import { Scheduler } from "./jsui-scheduler";

export class Root extends EventEmitter {
  constructor(Reconciler, element, host) {
    super();

    this.element = new Element(RootNode, null, [element]);
    this.host = host;

    this.scheduler = new Scheduler(this);
    this.reconciler = new Reconciler(this);
    this.pending = [];
  }

  computeNextUpdate() {
    this.element.update(this.scheduler, this.reconciler.begin(), this.element);
    this.pending.push(this.reconciler.end());
  }

  uploadNextUpdate() {
    const update = this.pending.pop();
    if (update) {
      this.reconciler.upload(this.element, this.host, update);
      this.emit("uploaded");
    }
  }
}
