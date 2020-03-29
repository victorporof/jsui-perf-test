import containmentCss from "containmentCss";
import contentCss from "contentCss";
import layoutCss from "layoutCss";

import React from "react";
import ReactDOM from "react-dom";

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
