import { Receiver } from "receiver";

import { Stats } from "../../util/stats";

import "./index.global.css";

import "../../lib/polyfill";

const wrapper = document.getElementById("shadow-host");
const receiver = new Receiver(wrapper);
receiver.listen();

const stats = Stats.main();
stats.appendIntoBody();
stats.trackAnimationFrame();
