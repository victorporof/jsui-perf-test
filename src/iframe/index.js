import "../lib/polyfill";

import "./index.css";

import "../util/fps";
import "../util/fps.css";

import { Root } from "./root";

const wrapper = document.getElementById("container");
window.jsuiRoot = new Root(wrapper);
