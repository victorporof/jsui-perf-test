import { Scheduler } from "./jsui-scheduler";

export default class JsUIDOM {
  static render(element, root, cb) {
    const scheduler = new Scheduler(element, root);
    scheduler.computeNextUpdate(cb);
  }
}
