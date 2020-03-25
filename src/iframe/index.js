import "../lib/polyfill";

import "./index.css";

import "../util/fps";
import "../util/fps.css";

import { Root } from "./root";

const wrapper = document.getElementById("shadow-host");
window.jsuiRoot = new Root(wrapper);
