export class Scheduler {
  constructor(root) {
    this.root = root;
    requestAnimationFrame(this.onAnimationFrame);
    window.addEventListener("message", this.onMessage, false);
  }

  onAnimationFrame = () => {
    requestAnimationFrame(this.onAnimationFrame);
    this.root.uploadNextUpdate();
  };

  onMessage = ({ data }) => {
    if (data.type == "update") {
      this.root.receiveNextUpdate(data.payload);
    }
  };
}
