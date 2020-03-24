import React from "react";
import ReactDOM from "react-dom";

import contentCss from "../css/content.raw.css";
import layoutCss from "../css/layout-block.raw.css";

import App from "./app";

const wrapper = document.getElementById("container");
const root = wrapper.attachOpaqueShadow();

ReactDOM.render(
  <div>
    <style>{contentCss}</style>
    <style>{layoutCss}</style>
    <App />
  </div>,
  root
);
