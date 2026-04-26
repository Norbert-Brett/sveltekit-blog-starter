import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function splitReveal(node, options = {}) {
  const { type = "chars", delay = 0, stagger = 0.03, duration = 1, ease = "power4.out" } = options;

  // Keep original text just in case
  const originalHTML = node.innerHTML;

  // Function to split text into words, then characters if needed
  const wrapText = (el) => {
    const text = el.innerText;
    el.innerHTML = "";
    el.style.opacity = "1";

    const words = text.split(" ");
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.overflow = "hidden";
      wordSpan.style.verticalAlign = "bottom";
      wordSpan.style.paddingBottom = "0.1em"; // Prevent clipping of descenders
      wordSpan.style.marginRight = "0.25em"; // Space between words
      wordSpan.className = "split-word";

      if (type === "chars") {
        const chars = word.split("");
        chars.forEach((char) => {
          const charSpan = document.createElement("span");
          charSpan.innerText = char;
          charSpan.style.display = "inline-block";
          charSpan.style.transform = "translateY(120%) rotateX(-45deg)";
          charSpan.style.transformOrigin = "bottom";
          charSpan.style.opacity = "0";
          charSpan.className = "split-char will-change-transform";
          wordSpan.appendChild(charSpan);
        });
      } else {
        // word split
        const innerWordSpan = document.createElement("span");
        innerWordSpan.innerText = word;
        innerWordSpan.style.display = "inline-block";
        innerWordSpan.style.transform = "translateY(120%) rotateX(-20deg)";
        innerWordSpan.style.transformOrigin = "bottom";
        innerWordSpan.style.opacity = "0";
        innerWordSpan.className = "split-inner-word will-change-transform";
        wordSpan.appendChild(innerWordSpan);
      }

      el.appendChild(wordSpan);

      // Don't add margin to the last word
      if (wordIndex === words.length - 1) {
        wordSpan.style.marginRight = "0";
      }
    });
  };

  wrapText(node);

  // Ensure GSAP ScrollTrigger is registered
  gsap.registerPlugin(ScrollTrigger);

  const targets =
    type === "chars"
      ? node.querySelectorAll(".split-char")
      : node.querySelectorAll(".split-inner-word");

  // Set initial states with GSAP to ensure smooth handoff
  gsap.set(targets, { yPercent: 120, rotateX: type === "chars" ? -45 : -20, opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: node,
      start: "top 90%",
    },
  });

  tl.to(targets, {
    yPercent: 0,
    rotateX: 0,
    opacity: 1,
    duration: duration,
    stagger: stagger,
    ease: ease,
    delay: delay,
    clearProps: "transform", // Clear to avoid blurriness on some screens
  });

  return {
    destroy() {
      tl.kill();
      ScrollTrigger.getById(node)?.kill();
      node.innerHTML = originalHTML;
    },
  };
}
