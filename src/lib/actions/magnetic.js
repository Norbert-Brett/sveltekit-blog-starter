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

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const moveX = (clientX - centerX) * strength;
    const moveY = (clientY - centerY) * strength;

    gsap.to(node, {
      x: moveX,
      y: moveY,
      duration: 0.6,
      ease: "power3.out",
    });

    if (textElement) {
      gsap.to(textElement, {
        x: (clientX - centerX) * textStrength,
        y: (clientY - centerY) * textStrength,
        duration: 0.6,
        ease: "power3.out",
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
      ease: "elastic.out(1, 0.3)",
    });

    if (textElement) {
      gsap.to(textElement, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)",
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
