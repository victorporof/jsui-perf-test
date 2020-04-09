import "./css/harness.global.css";
import containmentCss from "containment.css";
import contentCss from "content.css";
import layoutCss from "layout.css";

import React from "react";
import ReactDOM from "react-dom";

import { App } from "./app";

// https://reactjs.org/docs/concurrent-mode-adoption.html

const wrapper = document.getElementById("container");
ReactDOM.createRoot(wrapper).render(
  <App>
    <style>{containmentCss}</style>
    <style>{contentCss}</style>
    <style>{layoutCss}</style>
  </App>
);
