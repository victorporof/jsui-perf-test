import "benchmark";

import "../lib/polyfill";

import { Stats } from "../util/stats";

const stats = Stats.main();
stats.appendIntoBody();
stats.trackAnimationFrame();
