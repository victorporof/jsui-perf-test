import Peer from "peerjs";

import { RemoteWebRTCRenderer } from "./jsui-reconciler";
import { Root } from "./jsui-root";

export const SENDER_ID = "57b2c68e-fa4f-4dba-bddf-96fae046da66";
export const RECEIVER_ID = "6127a428-2c98-4525-baec-8aa911376398";

export default class JsUIDOM {
  static render(element, host, cb = () => {}) {
    const peer = new Peer(SENDER_ID, {
      host: "localhost",
      port: 9000,
    });

    const conn = peer.connect(RECEIVER_ID);
    conn.on("open", () => {
      const jsuiRoot = new Root(RemoteWebRTCRenderer, element, conn);
      jsuiRoot.once("uploaded", cb);
      jsuiRoot.computeNextUpdate();
    });
  }
}
