import assert from "assert";

export class Scheduler {
  constructor(root) {
    this.root = root;
    this.dirty = false;
    this.rendering = false;
    requestAnimationFrame(this.onAnimationFrame);
  }

  onAnimationFrame = () => {
    requestAnimationFrame(this.onAnimationFrame);

    if (this.rendering) {
      assert(SYNC_MODE == "strict");
      return;
    }

    this.root.uploadNextUpdate(this.onWillUpload, this.onUploaded, this.onSkipped);
    this.computeNextUpdateIfNeeded();
  };

  onWillUpload = () => {
    this.rendering = true;
  };

  onUploaded = () => {
    this.rendering = false;
  };

  onSkipped = () => {
    // noop
  };

  computeNextUpdateIfNeeded() {
    if (this.dirty) {
      this.dirty = false;
      this.root.computeNextUpdate();
    }
  }

  computeUpdateNextFrame() {
    this.dirty = true;
  }
}
