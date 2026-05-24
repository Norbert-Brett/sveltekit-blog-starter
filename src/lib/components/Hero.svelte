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
  let mouseX = $state(0);
  let mouseY = $state(0);
  let windowWidth = $state(0);
  let windowHeight = $state(0);
  let ctx;
  let animationFrameId;

  const headline = ['Building', 'intelligent', 'systems.'];

  onMount(() => {
    if (!browser || !heroSection || !textRef) return;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    ctx = gsap.context(() => {
      // 1. Initial State configurations for reveal
      gsap.set('.hero-text-group', { opacity: 0, scale: 0.95, y: -20 });
      gsap.set('.hero-marquee-wrapper', { opacity: 0, scale: 0.92 });
      gsap.set('.hero-cta-wrapper', { opacity: 0, y: 50 });
      gsap.set('.scroll-indicator', { opacity: 0 });

      // Subtle entrance for scroll indicator to hint page scrolling
      gsap.to('.scroll-indicator', { opacity: 1, duration: 1, delay: 0.5 });

      // 2. Cinematic Morphing & Pinned Exit Animation: Unified in a Single Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: '+=250%', // Pinned viewport scroll length (extended to make transitions buttery smooth)
          scrub: 1.2,    // Highly fluid inertia scrub damping
          pin: true,
          anticipatePin: 1
        }
      });

      // --- PHASE 1: Scale down video wrapper & reveal content smoothly ---
      // Video wrapper shrinks to 48% scale, gains rounded borders, drops to 1.0 (remains opaque and solid)
      tl.to('.hero-video-wrapper', {
        scale: 0.48,
        borderRadius: '32px',
        opacity: 1,
        boxShadow: '0 20px 80px rgba(0,0,0,0.65)',
        border: '1px solid var(--border)',
        ease: 'power2.inOut',
        duration: 2
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

      // Hero text group (headline & subtitle) fades & translates in
      tl.to('.hero-text-group', {
        opacity: 1,
        scale: 1,
        y: 0,
        ease: 'power2.out',
        duration: 1.8
      }, 0.4);

      // CTA button slides in directly below the shrunk video
      tl.to('.hero-cta-wrapper', {
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        duration: 1.5
      }, 0.7);

      // --- PHASE 2: Visual Hold (gives a smooth scroll buffer to read and interact) ---
      tl.to({}, { duration: 1.5 });

      // --- PHASE 3: Seamless Scroll-Out Exit (Cohesive fade and translate, optimized for GPU performance) ---
      tl.to('.hero-video-wrapper, .hero-text-group, .hero-marquee-wrapper, .hero-cta-wrapper', {
        opacity: 0,
        y: -70,
        scale: 0.94,
        stagger: 0.04,
        ease: 'power2.inOut',
        duration: 1.0
      });

      // 3. Magnetic Tracking on the text group
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

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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

  <!-- 2. Background Video (morphing scaling wrapper, z-index 20) -->
  <div class="hero-video-wrapper absolute inset-0 w-full h-full z-20 overflow-hidden bg-background origin-center border border-transparent gpu-accelerated">
    <video 
      autoplay 
      loop 
      muted 
      playsinline
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

  <!-- 3. Kinetic Text (Headline & Subtitle, z-index 30) -->
  <div 
    bind:this={textRef} 
    class="hero-text-group absolute inset-x-0 top-[12%] md:top-[14%] z-30 flex flex-col items-center pointer-events-none px-6 gpu-accelerated"
  >
    <h1 class="relative z-10 text-center flex flex-col leading-[1.05] tracking-tight text-foreground drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {#each headline as word, wi (wi)}
        <span class="overflow-hidden py-1">
          <span
            class="hero-word inline-block text-[8.5vw] md:text-[6.5vw] lg:text-[5.5vw] font-black uppercase tracking-tighter will-change-transform"
            style="{wi === 1 ? 'color: var(--color-accent);' : 'color: var(--color-foreground);'}"
          >
            {word}
          </span>
        </span>
      {/each}
    </h1>

    <!-- Subtitle -->
    <p class="hero-subtitle relative z-10 mt-6 text-xs md:text-sm font-sans tracking-[0.25em] text-foreground/80 text-center font-bold uppercase">
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
      class="hero-cta flex items-center gap-3 px-6 py-3.5 md:px-8 md:py-4 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-all duration-300 shadow-2xl interactive group"
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
</style>
