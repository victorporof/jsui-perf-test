import "./stats.global.css";

import classnames from "classnames";
import once from "lodash/once";
import { default as RawStats } from "stats.js";

export class Stats {
  constructor(className) {
    const stats = new RawStats();
    stats.dom.removeAttribute("style");
    stats.dom.className = classnames("stats", className);
    this.stats = stats;
    this.custom = [];
  }

  addCustomPanel(className, displayName, fgColor = "#ff8", bgColor = "#221") {
    const panel = this.stats.addPanel(new RawStats.Panel(displayName, fgColor, bgColor));
    panel.dom.setAttribute("custom", true);
    panel.dom.className = className;
    this.custom.push(panel);
  }

  updateCustomPanel(index, value, range) {
    this.custom[index].update(value, range);
  }

  static main = once(() => {
    return new Stats("main-stats");
  });

  appendIntoBody = once(() => {
    document.body.appendChild(this.stats.dom);
  });

  trackAnimationFrame = once(() => {
    const animate = () => {
      this.stats.update();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  });
}
