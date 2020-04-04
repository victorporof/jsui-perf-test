import { Receiver } from "receiver";

import "./index.global.css";

import "../../lib/polyfill";
import "../../util/fps";

const wrapper = document.getElementById("shadow-host");
const receiver = new Receiver(wrapper);
receiver.listen();
