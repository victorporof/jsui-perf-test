import contentCss from "content";
import layoutCss from "layout";

import React from "react";
import ReactDOM from "react-dom";

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
