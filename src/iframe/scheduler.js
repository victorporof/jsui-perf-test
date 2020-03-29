import { stats } from "../util/fps";

export class Scheduler {
  constructor(root) {
    this.root = root;
    window.addEventListener("message", this.onMessage, false);
  }

  onMessage = ({ data }) => {
    if (data.type == "update") {
      stats.update();
      this.root.receiveNextUpdate(data.payload);
      this.root.uploadNextUpdate();
    }
  };
}
