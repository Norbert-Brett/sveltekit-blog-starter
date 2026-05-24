import gsap from "gsap";

export function magnetic(node, options = {}) {
  const { strength = 0.5, textStrength = 0.2 } = options;

  let boundingRect = node.getBoundingClientRect();
  let isHovering = false;

  // Sometimes we want to also magnetically pull the text inside the button
  const textElement = node.querySelector(".magnetic-text") || node.firstElementChild;

  const onMouseMove = (e) => {
    if (!isHovering) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = boundingRect;

    // Map mouse position relative to boundaries using GSAP utils
    const mapX = gsap.utils.mapRange(left, left + width, -width / 2, width / 2, clientX);
    const mapY = gsap.utils.mapRange(top, top + height, -height / 2, height / 2, clientY);

    gsap.to(node, {
      x: mapX * strength,
      y: mapY * strength,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });

    if (textElement) {
      gsap.to(textElement, {
        x: mapX * textStrength,
        y: mapY * textStrength,
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
      });
    }
  };

  const onMouseEnter = () => {
    boundingRect = node.getBoundingClientRect();
    isHovering = true;
  };

  const onMouseLeave = () => {
    isHovering = false;
    gsap.to(node, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
      overwrite: true,
    });

    if (textElement) {
      gsap.to(textElement, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.4)",
        overwrite: true,
      });
    }
  };

  const onResize = () => {
    boundingRect = node.getBoundingClientRect();
  };

  node.addEventListener("mousemove", onMouseMove);
  node.addEventListener("mouseenter", onMouseEnter);
  node.addEventListener("mouseleave", onMouseLeave);
  window.addEventListener("resize", onResize);

  return {
    destroy() {
      node.removeEventListener("mousemove", onMouseMove);
      node.removeEventListener("mouseenter", onMouseEnter);
      node.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    },
  };
}
