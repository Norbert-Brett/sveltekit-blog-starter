<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';

  let cursorOrb = $state(null);
  let cursorGlow = $state(null);
  let cursorTrail = $state(null);
  let isTouchDevice = $state(true); // Default true so we never flash cursor on touch
  let requestRef;

  // Positions with separate interpolation speeds
  let mouse = { x: -100, y: -100 };
  let orbPos = { x: -100, y: -100 };
  let glowPos = { x: -100, y: -100 };
  let velocity = { x: 0, y: 0 };
  let prevMouse = { x: -100, y: -100 };
  let isHovering = $state(false);
  let isPressed = $state(false);
  let isVisible = $state(false);

  // Trail particles
  let trailPoints = [];
  const TRAIL_LENGTH = 12;
  const TRAIL_FADE = 0.85;

  onMount(() => {
    if (!browser) return;

    // Robust device detection: check pointer capability AND touch support
    const hasCoarsePointer = matchMedia('(pointer: coarse)').matches;
    const hasFinePointer = matchMedia('(pointer: fine)').matches;
    const hasTouchEvents = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Only show custom cursor on devices with a fine pointer (mouse/trackpad)
    // Even hybrid devices (touch + mouse) get it if they have a fine pointer
    if (hasCoarsePointer && !hasFinePointer) {
      isTouchDevice = true;
      return;
    }

    isTouchDevice = false;

    // Mark html so global CSS hides native cursor
    document.documentElement.classList.add('has-custom-cursor');

    // Initialize trail points
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      trailPoints.push({ x: -100, y: -100, alpha: 0 });
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!isVisible) isVisible = true;
    };

    const onMouseDown = () => {
      isPressed = true;
      if (cursorOrb) {
        gsap.to(cursorOrb, {
          scale: 0.6,
          duration: 0.15,
          ease: 'power3.out'
        });
      }
    };

    const onMouseUp = () => {
      isPressed = false;
      if (cursorOrb) {
        gsap.to(cursorOrb, {
          scale: isHovering ? 1.8 : 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.4)'
        });
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (cursorOrb) gsap.set(cursorOrb, { opacity: 0 });
      if (cursorGlow) gsap.set(cursorGlow, { opacity: 0 });
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (cursorOrb) gsap.to(cursorOrb, { opacity: 1, duration: 0.3 });
    };

    const render = () => {
      // Compute velocity for stretch/skew effect
      velocity.x = mouse.x - prevMouse.x;
      velocity.y = mouse.y - prevMouse.y;
      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;

      const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

      // Orb follows mouse with tight spring
      orbPos.x += (mouse.x - orbPos.x) * 0.2;
      orbPos.y += (mouse.y - orbPos.y) * 0.2;

      // Glow follows with heavier lag
      glowPos.x += (mouse.x - glowPos.x) * 0.08;
      glowPos.y += (mouse.y - glowPos.y) * 0.08;

      // Velocity-based organic morphing: stretches in direction of movement
      const angle = Math.atan2(velocity.y, velocity.x);
      const stretch = Math.min(speed * 0.015, 0.35);
      const skewX = velocity.x * 0.12;
      const skewY = velocity.y * 0.06;
      const dynamicRotation = angle * (180 / Math.PI);

      if (cursorOrb && isVisible) {
        gsap.set(cursorOrb, {
          x: orbPos.x,
          y: orbPos.y,
          skewX: gsap.utils.clamp(-12, 12, skewX),
          skewY: gsap.utils.clamp(-6, 6, skewY),
          scaleX: 1 + stretch,
          scaleY: 1 - stretch * 0.5,
          rotation: dynamicRotation * 0.08
        });
      }

      if (cursorGlow && isVisible) {
        gsap.set(cursorGlow, {
          x: glowPos.x,
          y: glowPos.y
        });
      }

      // Update trail
      if (cursorTrail && isVisible) {
        const ctx = cursorTrail.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, cursorTrail.width, cursorTrail.height);

          // Shift points
          for (let i = trailPoints.length - 1; i > 0; i--) {
            trailPoints[i].x = trailPoints[i - 1].x;
            trailPoints[i].y = trailPoints[i - 1].y;
            trailPoints[i].alpha = trailPoints[i - 1].alpha * TRAIL_FADE;
          }
          trailPoints[0].x = orbPos.x;
          trailPoints[0].y = orbPos.y;
          trailPoints[0].alpha = Math.min(speed * 0.04, 0.6);

          // Draw trail as diminishing gold dots
          for (let i = 1; i < trailPoints.length; i++) {
            const p = trailPoints[i];
            if (p.alpha < 0.01) continue;
            const size = (1 - i / trailPoints.length) * 3;
            ctx.beginPath();
            ctx.arc(p.x * window.devicePixelRatio, p.y * window.devicePixelRatio, size * window.devicePixelRatio, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 176, 85, ${p.alpha})`;
            ctx.fill();
          }
        }
      }

      requestRef = requestAnimationFrame(render);
    };

    // Interactive element delegation
    const onElementHover = (e) => {
      const target = e.target.closest('a, button, .interactive, input, textarea, [role="button"]');
      if (target) {
        isHovering = true;
        if (cursorOrb) {
          gsap.to(cursorOrb, {
            scale: 1.8,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: true
          });
        }
        if (cursorGlow) {
          gsap.to(cursorGlow, {
            opacity: 1,
            scale: 1.2,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      }
    };

    const onElementLeave = (e) => {
      const target = e.target.closest('a, button, .interactive, input, textarea, [role="button"]');
      if (target) {
        isHovering = false;
        if (cursorOrb) {
          gsap.to(cursorOrb, {
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
            overwrite: true
          });
        }
        if (cursorGlow) {
          gsap.to(cursorGlow, {
            opacity: 0.4,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      }
    };

    // Canvas sizing
    const resizeCanvas = () => {
      if (cursorTrail) {
        cursorTrail.width = window.innerWidth * window.devicePixelRatio;
        cursorTrail.height = window.innerHeight * window.devicePixelRatio;
        cursorTrail.style.width = window.innerWidth + 'px';
        cursorTrail.style.height = window.innerHeight + 'px';
      }
    };

    resizeCanvas();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', onElementHover);
    document.addEventListener('mouseout', onElementLeave);
    window.addEventListener('resize', resizeCanvas);

    requestRef = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', onElementHover);
      document.removeEventListener('mouseout', onElementLeave);
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef) cancelAnimationFrame(requestRef);
    };
  });

  onDestroy(() => {
    if (requestRef) cancelAnimationFrame(requestRef);
    if (browser) document.documentElement.classList.remove('has-custom-cursor');
  });
</script>

{#if !isTouchDevice}
  <!-- Trail canvas layer -->
  <canvas
    bind:this={cursorTrail}
    class="cursor-trail"
    class:visible={isVisible}
  ></canvas>

  <!-- Ambient glow: heavy lag, diffuse gold aura -->
  <div
    bind:this={cursorGlow}
    class="cursor-glow"
    class:hovering={isHovering}
    class:visible={isVisible}
  ></div>

  <!-- Primary orb: the gravitational lens -->
  <div
    bind:this={cursorOrb}
    class="cursor-orb"
    class:hovering={isHovering}
    class:pressed={isPressed}
    class:visible={isVisible}
  >
    <div class="cursor-orb-inner"></div>
  </div>
{/if}

<style>
  /* ── Trail Canvas ── */
  .cursor-trail {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 99997;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .cursor-trail.visible {
    opacity: 1;
  }

  /* ── Ambient Glow ── */
  .cursor-glow {
    position: fixed;
    top: 0;
    left: 0;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99998;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.4s ease;
    background: radial-gradient(
      circle,
      rgba(212, 176, 85, 0.08) 0%,
      rgba(212, 176, 85, 0.03) 40%,
      transparent 70%
    );
    filter: blur(8px);
  }
  .cursor-glow.visible {
    opacity: 0.4;
  }
  .cursor-glow.hovering {
    background: radial-gradient(
      circle,
      rgba(212, 176, 85, 0.15) 0%,
      rgba(212, 176, 85, 0.06) 40%,
      transparent 70%
    );
  }

  /* ── Primary Orb ── */
  .cursor-orb {
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .cursor-orb.visible {
    opacity: 1;
  }

  .cursor-orb-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    /* A unique crescent / eclipse gradient, not a simple solid dot */
    background:
      radial-gradient(
        circle at 35% 35%,
        rgba(244, 239, 230, 0.95) 0%,
        rgba(212, 176, 85, 0.85) 30%,
        rgba(212, 176, 85, 0.4) 60%,
        transparent 80%
      );
    box-shadow:
      0 0 6px rgba(212, 176, 85, 0.5),
      0 0 20px rgba(212, 176, 85, 0.15),
      inset 0 0 4px rgba(244, 239, 230, 0.3);
    transition:
      box-shadow 0.3s ease,
      background 0.3s ease;
  }

  .cursor-orb.hovering .cursor-orb-inner {
    background:
      radial-gradient(
        circle at 50% 50%,
        rgba(244, 239, 230, 0.15) 0%,
        rgba(212, 176, 85, 0.12) 40%,
        transparent 70%
      );
    box-shadow:
      0 0 12px rgba(212, 176, 85, 0.35),
      0 0 40px rgba(212, 176, 85, 0.1),
      inset 0 0 8px rgba(212, 176, 85, 0.15);
    border: 1px solid rgba(212, 176, 85, 0.25);
  }

  .cursor-orb.pressed .cursor-orb-inner {
    box-shadow:
      0 0 2px rgba(212, 176, 85, 0.8),
      0 0 8px rgba(212, 176, 85, 0.3);
  }

  /* ── Hide native cursor on fine-pointer devices ── */
  :global(html.has-custom-cursor),
  :global(html.has-custom-cursor *) {
    cursor: none !important;
  }
</style>
