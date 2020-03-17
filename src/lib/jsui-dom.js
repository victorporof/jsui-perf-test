import { Scheduler } from "./jsui-scheduler";

export default class JsUIDOM {
  static render(element, host) {
    host.prepare();

    const scheduler = new Scheduler(element, host);
    scheduler.computeNextUpdate();
  }
}
