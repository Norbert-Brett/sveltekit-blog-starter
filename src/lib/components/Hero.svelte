<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { magnetic } from '$lib/actions/magnetic.js';
  import { Marquee } from '$lib/components/magic/marquee';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let heroSection = $state(null);
  let textRef = $state(null);
  let ctaRef = $state(null);
  let headlineEl = $state(null);
  let subtitleEl = $state(null);
  let mouseX = $state(0);
  let mouseY = $state(0);
  let windowWidth = $state(0);
  let windowHeight = $state(0);
  let isMobile = $state(false);
  let ctx;
  let animationFrameId;
  let resizeTimer;

  const headline = ['Building', 'intelligent', 'systems.'];

  function setupGSAP() {
    if (!browser || !heroSection || !textRef || !headlineEl || !subtitleEl) return;

    if (ctx) ctx.revert();

    // Reset styles so we get accurate bounding rects
    gsap.set([headlineEl, subtitleEl, '.hero-video-wrapper', '.hero-cta-wrapper', '.scroll-indicator', '.hero-hud-inner', '.hero-badge-inner'], { clearProps: 'all' });

    const isMobileDevice = windowWidth < 768 || matchMedia('(pointer: coarse)').matches;

    if (isMobileDevice) {
      // MOBILE LIGHTWEIGHT INITIALIZATION (NO PINNING, NO SHRINKING, NO CORNER TRANSITIONS)
      ctx = gsap.context(() => {
        // Initial States for mobile (centered, no translate, clean opacity fade)
        gsap.set('.scroll-indicator', { opacity: 0 });
        gsap.set('.hero-hud-inner', { opacity: 0 });
        gsap.set('.hero-badge-inner', { opacity: 0 });
        gsap.set(headlineEl, { opacity: 0, y: 20 });
        gsap.set(subtitleEl, { opacity: 0, y: 15 });
        gsap.set('.hero-cta-wrapper', { opacity: 0, y: 15 });

        // Simple hardware-accelerated entrance animations on load
        gsap.to('.scroll-indicator', { opacity: 1, duration: 1, delay: 0.6 });
        gsap.to('.hero-hud-inner', { opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.1 });
        gsap.to('.hero-badge-inner', { opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.2 });
        gsap.to(headlineEl, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 });
        gsap.to(subtitleEl, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.4 });
        gsap.to('.hero-cta-wrapper', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.5 });
      }, heroSection);
      return;
    }

    // DESKTOP CINEMATIC PINNED ANIMATION
    const hRect = headlineEl.getBoundingClientRect();
    const sRect = subtitleEl.getBoundingClientRect();

    const hScale = 0.18;
    const sScale = 0.85;

    const hX = 48 - hRect.left;
    const hY = 40 - hRect.top;

    const sX = (windowWidth - 48) - sRect.right;
    const sY = 40 - sRect.top;

    ctx = gsap.context(() => {
      // 1. Initial State configurations
      gsap.set('.hero-marquee-wrapper', { opacity: 0, scale: 0.92 });
      gsap.set('.hero-cta-wrapper', { opacity: 0, y: 50 });
      gsap.set('.scroll-indicator', { opacity: 0 });

      // Subtle entrance for scroll indicator
      gsap.to('.scroll-indicator', { opacity: 1, duration: 1, delay: 0.5 });

      // HUD and Center badge inner entrance (independent of scroll)
      gsap.fromTo('.hero-hud-inner', 
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.1 }
      );

      gsap.fromTo('.hero-badge-inner', 
        { opacity: 0 },
        { opacity: 1, duration: 1.8, ease: 'power3.out', delay: 0.3 }
      );

      // Set corner positions initially with opacity 0 for fade in
      gsap.set(headlineEl, {
        x: hX,
        y: hY,
        scale: hScale,
        transformOrigin: 'top left',
        opacity: 0
      });

      gsap.set(subtitleEl, {
        x: sX,
        y: sY,
        scale: sScale,
        transformOrigin: 'top right',
        opacity: 0
      });

      // 2. Cinematic Morphing & Pinned Exit Animation: Unified in a Single Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: '+=120%',
          scrub: 1.2,    // Highly fluid inertia scrub damping
          pin: true,
          anticipatePin: 1
        }
      });

      // --- PHASE 1: Scale down video wrapper & reveal content smoothly ---
      tl.to('.hero-video-wrapper', {
        scale: 0.48,
        borderRadius: '32px',
        opacity: 1,
        boxShadow: '0 20px 80px rgba(0,0,0,0.65)',
        border: '1px solid var(--border)',
        ease: 'power2.inOut',
        duration: 2
      }, 0);

      // Center badge and HUD overlay fade out as video shrinks
      tl.fromTo('.hero-center-badge', {
        opacity: 1,
        scale: 1
      }, {
        opacity: 0,
        scale: 0.6,
        ease: 'power2.inOut',
        duration: 1.6
      }, 0);

      // HUD overlay fades out
      tl.fromTo('.hero-hud-overlay', {
        opacity: 1
      }, {
        opacity: 0,
        ease: 'power2.out',
        duration: 1.0
      }, 0);

      // Scroll indicator fades out fast
      tl.to('.scroll-indicator', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, 0);

      // Double marquee running behind fades and scales in
      tl.to('.hero-marquee-wrapper', {
        opacity: 1,
        scale: 1,
        ease: 'power2.out',
        duration: 1.5
      }, 0.3);

      // Headline grows and centers as video shrinks
      tl.to(headlineEl, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        transformOrigin: 'center center',
        ease: 'power2.inOut',
        duration: 2
      }, 0);

      // Subtitle grows and centers as video shrinks
      tl.to(subtitleEl, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        transformOrigin: 'center center',
        ease: 'power2.inOut',
        duration: 2
      }, 0.1);

      // CTA button slides in directly below the shrunk video
      tl.to('.hero-cta-wrapper', {
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        duration: 1.5
      }, 0.7);

      // --- PHASE 2: Morph Complete (unpins immediately for organic scrolling) ---
      tl.to({}, { duration: 0.1 });

      // 3. Magnetic Tracking on the text group (desktop only)
      const xTo = gsap.quickTo(textRef, 'x', { duration: 0.8, ease: 'power3' });
      const yTo = gsap.quickTo(textRef, 'y', { duration: 0.8, ease: 'power3' });

      const animateMagnet = () => {
        const cx = windowWidth / 2;
        const cy = windowHeight / 2;
        const dx = (mouseX - cx) / cx;
        const dy = (mouseY - cy) / cy;
        xTo(dx * 25);
        yTo(dy * 15);
        animationFrameId = requestAnimationFrame(animateMagnet);
      };
      animateMagnet();
    }, heroSection);
  }

  onMount(() => {
    if (!browser || !heroSection || !textRef) return;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    isMobile = windowWidth < 768 || matchMedia('(pointer: coarse)').matches;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        isMobile = windowWidth < 768 || matchMedia('(pointer: coarse)').matches;
        setupGSAP();
      }, 250);
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);

    setupGSAP();

    return () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (ctx) ctx.revert();
    };
  });

  onDestroy(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (ctx) ctx.revert();
  });
</script>

<section
  bind:this={heroSection}
  class="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-background"
>
  {#if !isMobile}
  <!-- 1. Double Marquee running behind the video -->
  <div class="hero-marquee-wrapper absolute inset-0 z-10 flex flex-col justify-center gap-12 md:gap-16 pointer-events-none select-none gpu-accelerated">
    <!-- Row 1: Left to Right (Current message, larger font, halved speed duration 360s, tight gap 0.5rem) -->
    <div class="w-full overflow-hidden">
      <Marquee pauseOnHover={false} class="[--duration:360s] [--gap:0.5rem]">
        <span class="text-[10vh] md:text-[12vh] lg:text-[13vh] font-sans font-black tracking-tighter uppercase text-primary whitespace-nowrap px-2 leading-none">
          Open to work · Full Stack · AI/ML · Svelte · Node · Python · LLMs ·
        </span>
      </Marquee>
    </div>

    <!-- Row 2: Right to Left (Role and open to work, outlined text, halved speed duration 440s, tight gap 0.5rem) -->
    <div class="w-full overflow-hidden">
      <Marquee reverse pauseOnHover={false} class="[--duration:440s] [--gap:0.5rem]">
        <span class="text-[10vh] md:text-[12vh] lg:text-[13vh] font-sans font-black tracking-tighter uppercase text-stroke-accent whitespace-nowrap px-2 leading-none opacity-30">
          Full Stack Developer · AI Specialist · Open to work · Available for projects ·
        </span>
      </Marquee>
    </div>
  </div>
  {/if}

  <!-- 2. Background Video (morphing scaling wrapper, z-index 20) -->
  <div class="hero-video-wrapper absolute inset-0 w-full h-full z-20 overflow-hidden bg-background origin-center border border-transparent gpu-accelerated">
    <video 
      autoplay 
      loop 
      muted 
      playsinline
      preload={isMobile ? 'none' : 'metadata'}
      poster="https://res.cloudinary.com/nbrett/image/upload/f_auto,q_auto/v1758661776/3170B43D-E178-4C7F-81A1-B4D0B128D021_zjinq2.jpg"
      class="hero-bg-video w-full h-full object-cover grayscale opacity-80 scale-105 gpu-accelerated"
    >
      <source src="https://res.cloudinary.com/nbrett/video/upload/f_auto:video,q_auto/v1768848615/video_un63ox.mov" type="video/mp4" />
    </video>
    
    <!-- Cinematic Dark Vignette Overlay for Ultimate Contrast -->
    <div class="absolute inset-0 bg-black/30 pointer-events-none"></div>
    
    <!-- Mobile/Global Fade Overlay -->
    <div class="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background"></div>
    <!-- Scroll-driven darkness overlay (camera iris) -->
    <div class="hero-overlay absolute inset-0 bg-background opacity-0 pointer-events-none"></div>
  </div>

  <!-- HUD Viewfinder Overlay (z-index 22, fades on scroll) -->
  <div class="hero-hud-overlay absolute inset-0 z-22 pointer-events-none select-none">
    <div class="hero-hud-inner relative w-full h-full opacity-0">
      <!-- Viewfinder Corners -->
      <div class="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-accent/30"></div>
      <div class="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-accent/30"></div>
      <div class="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-accent/30"></div>
      <div class="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-accent/30"></div>

      <!-- HUD Stats & Indicators -->
      <div class="absolute top-8 left-20 text-[9px] font-mono tracking-[0.2em] text-foreground/45 uppercase hidden sm:block">
        SYS: ACTIVE // LENS: CRT-X
      </div>
      <div class="absolute top-8 right-20 text-[9px] font-mono tracking-[0.2em] text-foreground/45 uppercase hidden sm:block">
        REC [●]
      </div>
      <div class="absolute bottom-8 left-20 text-[9px] font-mono tracking-[0.2em] text-foreground/45 uppercase hidden sm:block">
        FPS: 60 // SHUTTER: 1/120s
      </div>
      <div class="absolute bottom-8 right-20 text-[9px] font-mono tracking-[0.2em] text-foreground/45 uppercase hidden sm:block">
        ANTIGRAVITY PROPULSION
      </div>
    </div>
  </div>

  <!-- Central Rotating Holographic Badge (z-index 25, fades on scroll) -->
  <div class="hero-center-badge absolute top-1/2 left-1/2 z-25 pointer-events-none select-none">
    <div class="hero-badge-inner relative flex items-center justify-center opacity-0">
      <!-- Spinning Circular Text Ring -->
      <svg class="w-40 h-40 md:w-52 md:h-52 text-accent/50 animate-spin-slow" viewBox="0 0 200 200">
        <defs>
          <path id="badgeCircle" d="M 100, 100 m -65, 0 a 65,65 0 1,1 130,0 a 65,65 0 1,1 -130,0" fill="none" />
        </defs>
        <text class="text-[9px] font-mono font-bold uppercase tracking-[0.25em] fill-current">
          <textPath href="#badgeCircle" startOffset="0%">
            NORBERT BRETT • DESIGN & CODE • AI ENGINEERING • FULL STACK ·
          </textPath>
        </text>
      </svg>

      <!-- Glassmorphic Pulse Center Core -->
      <div class="absolute w-20 h-20 md:w-24 md:h-24 rounded-full glass-panel border border-accent/25 flex items-center justify-center shadow-[0_8px_32px_0_var(--glass-shadow)] backdrop-blur-md">
        <span class="w-3.5 h-3.5 rounded-full bg-accent animate-pulse shadow-[0_0_15px_var(--color-accent)]"></span>
      </div>
    </div>
  </div>

  <!-- 3. Kinetic Text (Headline & Subtitle, z-index 30) -->
  <div 
    bind:this={textRef} 
    class="hero-text-group absolute inset-x-0 top-[12%] md:top-[14%] z-30 flex flex-col items-center pointer-events-none px-6 gpu-accelerated"
  >
    <h1 bind:this={headlineEl} class="hero-headline relative z-10 text-center flex flex-col leading-[1.05] tracking-tight text-foreground drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {#each headline as word, wi (wi)}
        <span class="overflow-hidden py-1">
          <span
            class="hero-word inline-block text-[8.5vw] md:text-[6.5vw] lg:text-[5.5vw] font-serif font-normal uppercase tracking-tighter will-change-transform"
            style="{wi === 1 ? 'color: var(--color-accent);' : 'color: var(--color-foreground);'}"
          >
            {word}
          </span>
        </span>
      {/each}
    </h1>

    <!-- Subtitle -->
    <p bind:this={subtitleEl} class="hero-subtitle relative z-10 mt-6 text-xs md:text-sm font-sans tracking-[0.25em] text-foreground/80 text-center font-bold uppercase">
      Full Stack Developer <span class="text-accent/80 mx-1">&bull;</span> AI Specialist
    </p>
  </div>

  <!-- 4. Pushed CTA Button (Fade-in under the smaller video, z-index 30) -->
  <div 
    bind:this={ctaRef}
    class="hero-cta-wrapper absolute inset-x-0 bottom-[10%] z-30 flex justify-center pointer-events-auto px-6 gpu-accelerated"
  >
    <a 
      href="/contact" 
      use:magnetic={{ strength: 0.3, textStrength: 0.1 }} 
      class="hero-cta flex items-center gap-3 px-6 py-3.5 md:px-8 md:py-4 rounded-full bg-foreground text-background hover:bg-foreground/90 active:scale-[0.97] hover:scale-105 transition-all duration-300 shadow-2xl interactive group"
    >
      <span class="magnetic-text flex items-center gap-3">
        <span class="text-sm font-sans font-semibold tracking-wide">Start a project</span>
        <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </span>
    </a>
  </div>

  <!-- 5. Scroll Indicator (Universally recognized scroll-down hint) -->
  <div class="scroll-indicator absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
    <svg width="20" height="30" viewBox="0 0 20 30" class="text-foreground/40">
      <rect x="1" y="1" width="18" height="28" rx="9" stroke="currentColor" stroke-width="1.5" fill="none" />
      <circle cx="10" cy="10" r="2" fill="currentColor" class="animate-float" />
    </svg>
  </div>
</section>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(10px); }
  }
  .animate-float {
    animation: float 2s ease-in-out infinite;
  }

  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 24s linear infinite;
  }

  @keyframes badge-float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-8px) scale(1.02); }
  }
  .hero-badge-inner {
    animation: badge-float 6s ease-in-out infinite;
  }

  .hero-center-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
