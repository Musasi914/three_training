import Experience from "./experience/Experience";
import "./style.css";

const canvasWrapper = document.querySelector(
  "#canvasWrapper"
) as HTMLDivElement;
new Experience(canvasWrapper);
