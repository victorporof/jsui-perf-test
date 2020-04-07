import EventEmitter from "events";

import { Element } from "./jsui-element";
import { RootNode } from "./jsui-primitive";
import { Scheduler } from "./jsui-scheduler";

export class Root extends EventEmitter {
  constructor(Reconciler, element, host) {
    super();

    this.element = new Element(RootNode, null, [element]);
    this.scheduler = new Scheduler(this);
    this.reconciler = new Reconciler(host);
    this.pending = [];
  }

  computeNextUpdate() {
    this.element.update(this.scheduler, this.reconciler.begin(), this.element);
    this.pending.push(this.reconciler.end());
  }

  uploadNextUpdate(onWillUpload, onUploaded, onSkipped = onWillUpload) {
    const update = {
      changelist: [],
      mountlist: [],
    };

    while (this.pending[0]) {
      const next = this.pending.shift();
      update.changelist = update.changelist.concat(next.changelist);
      update.mountlist = update.mountlist.concat(next.mountlist);
    }

    if (update.changelist.length || update.mountlist.length) {
      onWillUpload();
      this.reconciler.upload(this.element, update, onUploaded);
      this.emit("uploaded");
      return;
    }

    onSkipped();
  }
}
