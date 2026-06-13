/**
 * Device detection and capability utilities
 * Helps determine what level of animations and effects to run based on device capabilities
 */

export const isLowEndDevice = () => {
  if (typeof window === "undefined") return false;

  // Check hardware concurrency (number of CPU cores)
  const hardwareConcurrency = navigator.hardwareConcurrency || 0;

  // Check device memory (in GB)
  const deviceMemory = navigator.deviceMemory || 0;

  // Consider low-end if:
  // - Less than 4 CPU cores OR
  // - Less than 4GB RAM
  return hardwareConcurrency < 4 || deviceMemory < 4;
};

export const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const getAnimationScale = () => {
  if (prefersReducedMotion()) return 0;
  if (isLowEndDevice()) return 0.5; // Reduce animation intensity by half
  return 1; // Full animations
};

export const shouldRunComplexAnimations = () => {
  return !prefersReducedMotion() && !isLowEndDevice();
};
