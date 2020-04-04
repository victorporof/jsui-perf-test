import { Receiver } from "receiver";

import { stats } from "../../util/fps";

import "./index.global.css";

import "../../lib/polyfill";

const wrapper = document.getElementById("shadow-host");
const receiver = new Receiver(wrapper);
receiver.listen();

const animate = () => {
  stats.update();
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
