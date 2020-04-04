import containmentCss from "containment.css";
import contentCss from "content.css";
import layoutCss from "layout.css";
import "../css/harness.global.css";

import React from "react";
import ReactDOM from "react-dom";

import { stats } from "../../../../util/fps";

import App from "./app";

const wrapper = document.getElementById("container");
ReactDOM.render(
  <>
    <style>{containmentCss}</style>
    <style>{contentCss}</style>
    <style>{layoutCss}</style>
    <App />
  </>,
  wrapper
);

const animate = () => {
  stats.update();
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
