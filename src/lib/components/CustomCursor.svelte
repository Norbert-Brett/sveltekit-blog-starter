<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';

  let cursorDot = $state(null);
  let cursorOutline = $state(null);
  let requestRef;
  
  let mouse = { x: 0, y: 0 };
  let pos = { x: 0, y: 0 };
  let outlinePos = { x: 0, y: 0 };
  let activeHover = $state(false);

  onMount(() => {
    if (!browser || matchMedia('(pointer: coarse)').matches) return; // Ignore on touch devices

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const render = () => {
      // Dot instantly follows mouse
      pos.x = mouse.x;
      pos.y = mouse.y;
      
      // Outline lags behind slightly
      outlinePos.x += (mouse.x - outlinePos.x) * 0.15;
      outlinePos.y += (mouse.y - outlinePos.y) * 0.15;

      if (cursorDot) {
        gsap.set(cursorDot, { x: pos.x, y: pos.y });
      }
      if (cursorOutline) {
        gsap.set(cursorOutline, { x: outlinePos.x, y: outlinePos.y });
      }

      requestRef = requestAnimationFrame(render);
    };

    const onMouseHover = () => {
      activeHover = true;
      gsap.to(cursorOutline, { scale: 1.5, opacity: 0.5, duration: 0.3 });
      gsap.to(cursorDot, { scale: 0, duration: 0.2 });
    };

    const onMouseLeave = () => {
      activeHover = false;
      gsap.to(cursorOutline, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(cursorDot, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove);
    requestRef = requestAnimationFrame(render);

    // Initial setup
    mouse.x = window.innerWidth / 2;
    mouse.y = window.innerHeight / 2;
    outlinePos.x = mouse.x;
    outlinePos.y = mouse.y;

    // Delegate events for links and buttons
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .interactive, input, textarea');
      if (target) onMouseHover();
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, .interactive, input, textarea');
      if (target) onMouseLeave();
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(requestRef);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  });
</script>

<div bind:this={cursorOutline} class="cursor-outline hidden md:block" class:active={activeHover}></div>
<div bind:this={cursorDot} class="cursor-dot hidden md:block"></div>

<style>
  .cursor-outline {
    position: fixed;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    border: 1px solid var(--color-accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 999999;
    transform: translate(-50%, -50%);
    mix-blend-mode: exclusion;
    transition: width 0.3s, height 0.3s, background-color 0.3s;
  }
  
  .cursor-outline.active {
    background-color: rgba(201, 168, 76, 0.1);
  }

  .cursor-dot {
    position: fixed;
    top: 0;
    left: 0;
    width: 6px;
    height: 6px;
    background-color: var(--color-accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 999999;
    transform: translate(-50%, -50%);
  }

  /* Hide default cursor only if custom cursor is active */
  :global(body:hover) {
    @media (pointer: fine) {
      cursor: none;
    }
  }

  :global(a:hover, button:hover, .interactive:hover) {
    @media (pointer: fine) {
      cursor: none;
    }
  }
</style>
