import { Container } from "./jsui-container";

export default class JsUIDOM {
  static render(element, host) {
    new Container(element, host).flushTreeIntoHost();
  }
}
