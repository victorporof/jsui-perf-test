import Stats from "stats.js";

const stats = new Stats();
stats.showPanel(0);

document.body.appendChild(stats.dom);

const animate = () => {
  stats.update();
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
