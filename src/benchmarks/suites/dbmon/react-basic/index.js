import containmentCss from "containment.css";
import contentCss from "content.css";
import layoutCss from "layout.css";
import "../css/harness.global.css";

import React from "react";
import ReactDOM from "react-dom";

import App from "./app";

const wrapper = document.getElementById("container");
ReactDOM.render(
  <App>
    <style>{containmentCss}</style>
    <style>{contentCss}</style>
    <style>{layoutCss}</style>
  </App>,
  wrapper
);
