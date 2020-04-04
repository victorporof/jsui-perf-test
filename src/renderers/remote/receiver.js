import assert from "assert";

export class Receiver {
  constructor(host) {
    this.opaqueShadowRoot = host.attachOpaqueShadow();

    this.pending = [];
    this.generation = 0;
  }

  listen() {
    assert.fail();
  }

  post(message) {
    assert.fail();
  }

  receive(data) {
    if (data.type != "update") {
      return;
    }
    this.pending.push(data.payload);
    this.pending.sort((a, b) => a.generation - b.generation);

    const generations = [];
    const update = {
      changelist: []
    };

    while (this.pending[0]?.generation == this.generation) {
      const next = this.pending.shift();
      update.changelist = update.changelist.concat(next.changelist);
      generations.push(this.generation);
      this.generation++;
    }

    if (!update.changelist.length) {
      return;
    }

    if (SYNC_MODE == "strict") {
      this.post({ type: "work-started", payload: { generations } });
    }

    this.opaqueShadowRoot.render(update.changelist);
  }
}
