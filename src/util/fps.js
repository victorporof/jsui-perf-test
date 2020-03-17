import Stats from "stats.js";

const stats = new Stats();

stats.dom.removeAttribute("style");
stats.dom.className = "stats";

document.body.appendChild(stats.dom);

const animate = () => {
  stats.update();
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
