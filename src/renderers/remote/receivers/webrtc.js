import Peer from "peerjs";

import { RECEIVER_ID } from "../../../lib/jsui/jsui-dom-webrtc";
import { Receiver as BaseReceiver } from "../receiver";

export class Receiver extends BaseReceiver {
  listen() {
    const peer = new Peer(RECEIVER_ID, {
      host: "localhost",
      port: 9000
    });

    peer.on("connection", conn => {
      this.conn = conn;

      conn.on("open", () => {
        conn.on("data", data => {
          this.receive(this.deserialize(data));
        });
      });
    });
  }

  post(data) {
    this.conn.send(this.serialize(data));
  }
}
