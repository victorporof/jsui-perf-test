export class Scheduler {
  constructor(root) {
    this.root = root;
    this.dirty = false;
    requestAnimationFrame(this.onAnimationFrame);
  }

  onAnimationFrame = () => {
    requestAnimationFrame(this.onAnimationFrame);

    this.root.uploadNextUpdate();

    if (this.dirty) {
      this.dirty = false;
      this.root.computeNextUpdate();
    }
  };

  computeUpdateNextFrame() {
    this.dirty = true;
  }
}
