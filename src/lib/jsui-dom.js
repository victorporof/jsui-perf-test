import { Scheduler } from "./jsui-scheduler";

export default class JsUIDOM {
  static render(element, host) {
    const scheduler = new Scheduler(element, host);
    scheduler.computeNextUpdate();
  }
}
