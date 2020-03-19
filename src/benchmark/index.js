import React from "react";
import ReactDOM from "react-dom";

import contentCss from "../css/content.shadow.css";
import layoutCss from "../css/layout-flex.shadow.css";

import App from "./app";

const wrapper = document.getElementById("container");
const root = wrapper.attachOpaqueShadow();

ReactDOM.render(<App />, root, () => {
  root.render([
    { type: "CreateElement", id: "content-css", tagName: "style" },
    { type: "CreateElement", id: "layout-css", tagName: "style" },
    { type: "Append", id: "content-css" },
    { type: "Append", id: "layout-css" },
    { type: "CreateTextNode", id: "content-css-src", textContent: contentCss },
    { type: "CreateTextNode", id: "layout-css-src", textContent: layoutCss },
    { type: "Append", id: "content-css-src", parentId: "content-css" },
    { type: "Append", id: "layout-css-src", parentId: "layout-css" }
  ]);
});
