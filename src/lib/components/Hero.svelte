<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { magnetic } from '$lib/actions/magnetic.js';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let heroSection = $state(null);
  let textRef = $state(null);
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
      // 1. High-Speed Kinetic Entrance (Trending Split-Text Mask Reveal)
      gsap.fromTo('.hero-char', 
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.02, ease: 'power4.out', delay: 0.1 }
      );

      // Subtitle reveal
      gsap.fromTo('.hero-subtitle', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.6 }
      );

      gsap.fromTo('.hero-cta', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.7 }
      );



      gsap.fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.8 });

      // 2. Cinematic scroll-out: multi-layer depth system
      // Layer 1 (The Blast): Hero text shoots towards the camera
      gsap.to('.hero-text-group', {
        scale: 4,
        opacity: 0,
        y: 50,
        filter: 'blur(30px)',
        ease: 'power3.in',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: '60% top',
          scrub: 0.5
        }
      });

      // Layer 2 (The Ignition): Video softly scales and blurs out
      gsap.to('.hero-bg-video', {
        scale: 1.1,
        filter: 'brightness(0.6) blur(6px)',
        ease: 'power2.in',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: '70% top',
          scrub: 1
        }
      });

      // Layer 3: Overlay darkens on scroll (camera iris closing)
      gsap.to('.hero-overlay', {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: '30% top',
          end: '90% top',
          scrub: true
        }
      });



      // 5. Scroll indicator fade-out on scroll
      gsap.to('.scroll-indicator', {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: heroSection,
          start: '5% top',
          end: '15% top',
          scrub: true
        }
      });

      // 6. Hero bottom border wipe-in
      gsap.fromTo('.hero-bottom-border',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: 'expo.out', delay: 0.8 }
      );

      // 7. Magnetic Tracking
      const xTo = gsap.quickTo(textRef, 'x', { duration: 0.8, ease: 'power3' });
      const yTo = gsap.quickTo(textRef, 'y', { duration: 0.8, ease: 'power3' });

      const animateMagnet = () => {
        const cx = windowWidth / 2;
        const cy = windowHeight / 2;
        const dx = (mouseX - cx) / cx;
        const dy = (mouseY - cy) / cy;
        xTo(dx * 30);
        yTo(dy * 20);
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
  <!-- Background Video (parallax layer) -->
  <div 
    class="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black"
  >
    <video 
      autoplay 
      loop 
      muted 
      playsinline
      poster="https://res.cloudinary.com/nbrett/image/upload/f_auto,q_auto/v1758661776/3170B43D-E178-4C7F-81A1-B4D0B128D021_zjinq2.jpg"
      class="hero-bg-video w-full h-full object-cover grayscale opacity-20 scale-105 gpu-accelerated mix-blend-screen"
    >
      <source src="https://res.cloudinary.com/nbrett/video/upload/f_auto:video,q_auto/v1768848615/video_un63ox.mov" type="video/mp4" />
    </video>
    
    <!-- Mobile/Global Fade Overlay -->
    <div class="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black"></div>
    <!-- Scroll-driven darkness overlay (camera iris) -->
    <div class="hero-overlay absolute inset-0 bg-black opacity-0 pointer-events-none"></div>
  </div>

  <!-- Kinetic Text (scroll-shrink group) -->
  <div bind:this={textRef} class="hero-text-group relative z-30 flex flex-col items-center pointer-events-auto interactive px-6 gpu-accelerated">
    <h1 class="relative z-10 font-bold text-center flex flex-col leading-[0.9] tracking-tight text-white drop-shadow-2xl">
      {#each headline as word, wi (wi)}
        <span class="flex justify-center overflow-hidden pb-1 md:pb-2">
          {#each word.split('') as char, ci (ci)}
            <span
              class="hero-char inline-block text-[12vw] md:text-[10vw] lg:text-[8vw] will-change-transform {wi === 1 ? 'hero-char--subtle' : ''}"
              style="{wi === 1 ? 'color: rgba(255, 255, 255, 0.7);' : ''}"
            >
              {char}
            </span>
          {/each}
        </span>
      {/each}
    </h1>

    <!-- Subtitle -->
    <p class="hero-subtitle relative z-10 mt-8 text-sm md:text-base font-sans tracking-wide text-white/60 text-center font-medium">
      Full Stack Developer · AI Specialist
    </p>

    <!-- Hick's Law & Von Restorff Effect: Single, highly isolated CTA -->
    <a href="/contact" use:magnetic={{ strength: 0.3, textStrength: 0.1 }} class="hero-cta mt-10 z-30 flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-2xl interactive group">
      <span class="magnetic-text flex items-center gap-3">
        <span class="text-sm font-sans font-semibold tracking-wide">Start a project</span>
        <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </span>
    </a>
  </div>



  <div class="hero-bottom-border absolute bottom-0 left-0 w-full h-px bg-white/10 z-20 origin-center"></div>

  <!-- Scroll Indicator (Jakob's Law: universally recognised scroll-down pattern) -->
  <div class="scroll-indicator absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-0">
    <svg width="20" height="30" viewBox="0 0 20 30" class="text-white/40">
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
