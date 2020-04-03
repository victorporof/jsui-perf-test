import { stats } from "../../util/fps";

export class Root {
  constructor(host) {
    this.opaqueShadowRoot = host.attachOpaqueShadow();

    this.pending = [];
    this.generation = 0;
  }

  listen() {
    window.addEventListener("message", this.onMessage, false);
  }

  onMessage = ({ data }) => {
    if (data.type != "update") {
      return;
    }

    stats.update();

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

    if (update.changelist.length) {
      parent.postMessage({ type: "work-started", payload: { generations } }, "*");
      this.opaqueShadowRoot.render(update.changelist);
    }
  };
}
