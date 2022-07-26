// Import stylesheets
import type { OffsetDirection, PointerType } from "@/data/state";
import styles from "./btn.module.scss";

const lineOrientation = (o: OffsetDirection): "vertical" | "horizontal" => {
  switch (o) {
    case "bottom":
      return "vertical";
    case "top":
      return "vertical";
    case "left":
      return "horizontal";
    case "right":
      return "horizontal";
  }
};

const cssLabel = (
  label: string,
  offset: OffsetDirection,
  labelLength: `${number}px`,
  pointerType: PointerType
) => {
  const template = /*html*/ `
  <div class=${styles.box} data-offset=${offset}>
    <div class=${styles.label}>${label}</div>
    <hr class=${styles.line} data-orientation=${lineOrientation(
    offset
  )} style="--label-line-length:${labelLength}"></hr>
    <div class=${
      pointerType === "circle" ? styles.circle : styles.rectangle
    }></div>
  </div>`;
  const container = document.createElement("div");
  container.innerHTML = template;
  return container;
};

export { cssLabel };
