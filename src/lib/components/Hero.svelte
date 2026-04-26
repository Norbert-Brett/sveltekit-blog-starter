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

  const headline = ['BUILDING', 'INTELLIGENT', 'SYSTEMS'];
  const tickerText = 'Open to work · Full Stack · AI/ML · Svelte · Node · Python · LLMs · ';

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
        { yPercent: 120, rotateX: -45, scale: 0.9, opacity: 0 },
        { yPercent: 0, rotateX: 0, scale: 1, opacity: 1, duration: 1, stagger: 0.02, ease: 'power4.out', delay: 0.1 }
      );

      gsap.fromTo('.hero-subtitle, .hero-cta, .hero-ticker', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'expo.out', delay: 0.4 }
      );

      gsap.fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.6 });
      
      // 4. Parallax Orbs
      gsap.to('.orb-1', {
        y: -200,
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
      gsap.to('.orb-2', {
        y: -100,
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      // 5. Magnetic Tracking
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
  <!-- Background Video -->
  <div 
    class="absolute inset-0 lg:left-auto lg:right-0 lg:w-[55%] z-0 overflow-hidden lg:mask-[linear-gradient(to_right,transparent,black_20%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent,black_20%)]"
  >
    <video 
      autoplay 
      loop 
      muted 
      playsinline
      poster="https://res.cloudinary.com/nbrett/image/upload/f_auto,q_auto/v1758661776/3170B43D-E178-4C7F-81A1-B4D0B128D021_zjinq2.jpg"
      class="hero-bg-video w-full h-full object-cover grayscale brightness-75 scale-110"
    >
      <source src="https://res.cloudinary.com/nbrett/video/upload/f_auto:video,q_auto/v1768848615/video_un63ox.mov" type="video/mp4" />
    </video>
    
    <!-- Mobile Overlay -->
    <div class="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent lg:hidden"></div>
  </div>

  <!-- Orbs -->
  <div class="orb-1 absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-glow-breathe"></div>
  <div class="orb-2 absolute bottom-[-30%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[100px] pointer-events-none animate-glow-breathe-delayed"></div>

  <!-- Kinetic Text -->
  <div bind:this={textRef} class="relative z-30 flex flex-col items-center pointer-events-auto interactive px-6">
    <div class="kinetic-overlay absolute inset-[-100px] z-0 pointer-events-none opacity-60"></div>

    <h1 class="relative z-10 font-bold uppercase text-center flex flex-col leading-[0.85] tracking-tighter text-white drop-shadow-[0_0_60px_rgba(0,0,0,0.8)]">
      {#each headline as word, wi (wi)}
        <span class="flex justify-center overflow-hidden pb-1 md:pb-2">
          {#each word.split('') as char, ci (ci)}
            <span
              class="hero-char inline-block text-[12vw] md:text-[10vw] lg:text-[9vw] will-change-transform {wi === 1 ? 'hero-char--glow' : ''}"
              style="{wi === 1 ? 'font-style: italic; opacity: 0.9;' : ''}"
            >
              {char}
            </span>
          {/each}
        </span>
      {/each}
    </h1>

    <p class="hero-subtitle relative z-10 mt-10 text-[10px] md:text-xs font-mono tracking-[0.6em] uppercase text-white/70 text-center drop-shadow-lg">
      Full Stack Developer · AI Specialist
    </p>

    <!-- Hick's Law & Von Restorff Effect: Single, highly isolated CTA -->
    <a href="/contact" use:magnetic={{ strength: 0.4, textStrength: 0.15 }} class="hero-cta mt-10 z-30 flex items-center gap-4 px-8 py-4 rounded-full bg-primary text-black hover:bg-white hover:scale-105 transition-all duration-500 shadow-[0_0_40px_rgba(var(--primary),0.4)] interactive group">
      <span class="magnetic-text flex items-center gap-4">
        <span class="w-2 h-2 rounded-full bg-black animate-pulse"></span>
        <span class="text-[11px] md:text-xs font-mono font-bold tracking-[0.2em] uppercase">Start a Project</span>
        <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </span>
    </a>
  </div>

  <!-- Ticker -->
  <div class="hero-ticker absolute bottom-20 left-0 w-full overflow-hidden z-20 pointer-events-none">
    <div class="absolute left-0 top-0 w-24 h-full bg-linear-to-r from-background to-transparent z-10"></div>
    <div class="absolute right-0 top-0 w-24 h-full bg-linear-to-l from-background to-transparent z-10"></div>
    <div class="marquee-track flex whitespace-nowrap animate-marquee">
      {#each Array(6) as _, i (i)}
        <span class="text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-white/50 pr-12">
          {tickerText}
        </span>
      {/each}
    </div>
  </div>

  <div class="hero-bottom-border absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/40 to-transparent z-20 origin-center"></div>

  <!-- Scroll Indicator -->
  <div class="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-0">
    <span class="text-[9px] font-mono tracking-[0.4em] uppercase text-white/60">Scroll</span>
    <svg width="20" height="30" viewBox="0 0 20 30" class="text-white/60">
      <rect x="1" y="1" width="18" height="28" rx="9" stroke="currentColor" stroke-width="1.5" fill="none" />
      <circle cx="10" cy="10" r="2" fill="currentColor" class="animate-float" />
    </svg>
  </div>
</section>

<style>
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: marquee 25s linear infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(10px); }
  }
  .animate-float {
    animation: float 2s ease-in-out infinite;
  }

  @keyframes glow-breathe {
    0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.5; }
    50% { transform: scale(1.1) translate(20px, 20px); opacity: 0.8; }
  }
  .animate-glow-breathe {
    animation: glow-breathe 8s ease-in-out infinite;
  }
  .animate-glow-breathe-delayed {
    animation: glow-breathe 12s ease-in-out infinite 2s;
  }



  .hero-char {
    text-shadow: 0 0 40px rgba(0,0,0,0.6);
  }

  .hero-char--glow {
    text-shadow: 0 0 60px rgba(var(--primary), 0.25), 0 0 120px rgba(var(--primary), 0.1);
    color: rgba(255, 255, 255, 0.92);
  }

  .kinetic-overlay {
    background: radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, transparent 80%);
    filter: blur(40px);
  }
</style>
