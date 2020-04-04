import { RemoteIframeRenderer } from "./jsui-reconciler";
import { Root } from "./jsui-root";

export default class JsUIDOM {
  static render(element, host, cb = () => {}) {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("src", "http://jsui-server.local:3000/");
    iframe.onload = () => {
      const jsuiRoot = new Root(RemoteIframeRenderer, element, iframe);
      jsuiRoot.once("uploaded", cb);
      jsuiRoot.computeNextUpdate();
    };
    host.appendChild(iframe);
  }
}
