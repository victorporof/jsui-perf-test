import { Scheduler } from "./scheduler";

export class Root {
  generation = 0;

  constructor(host) {
    this.opaqueShadowRoot = host.attachOpaqueShadow();

    this.scheduler = new Scheduler(this);
    this.pending = [];
  }

  receiveNextUpdate(update) {
    this.pending.push(update);
  }

  uploadNextUpdate() {
    this.pending.sort((a, b) => a.generation - b.generation);

    const update = {
      changelist: []
    };

    while (this.pending[0]?.generation == this.generation) {
      const next = this.pending.shift();
      update.changelist = update.changelist.concat(next.changelist);
      this.generation++;
    }

    if (update.changelist.length) {
      this.opaqueShadowRoot.render(update.changelist);
    }
  }
}
