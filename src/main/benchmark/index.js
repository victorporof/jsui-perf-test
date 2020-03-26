import React from "react";
import ReactDOM from "react-dom";

import contentCss from "../css/content.raw.css";
import layoutCss from "../css/layout-block+flex.raw.css";

import App from "./app";

const wrapper = document.getElementById("container");

ReactDOM.render(
  <>
    <style>{contentCss}</style>
    <style>{layoutCss}</style>
    <App />
  </>,
  wrapper
);
