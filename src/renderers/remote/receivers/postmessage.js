import { Receiver as BaseReceiver } from "../receiver";

export class Receiver extends BaseReceiver {
  listen() {
    window.addEventListener("message", ({ data }) => this.receive(this.deserialize(data)), false);
  }

  post(data) {
    parent.postMessage(this.serialize(data), "*");
  }
}
