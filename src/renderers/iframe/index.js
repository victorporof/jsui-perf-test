import "./index.global.css";

import "../../lib/polyfill";
import "../../util/fps";

import { Root } from "./root";

const wrapper = document.getElementById("shadow-host");
const root = new Root(wrapper);
root.listen();
