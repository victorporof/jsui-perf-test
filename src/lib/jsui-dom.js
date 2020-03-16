import { Container } from "./jsui-container";

export default class JsUIDOM {
  static render(element, host) {
    const container = new Container(element, host);
    container.flushTreeIntoHost();
  }
}
