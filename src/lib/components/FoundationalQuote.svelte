<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let { 
    quote = 'Trust in the Lord with all thine heart', 
    highlightedWord = 'Lord', 
    subQuote = 'And lean not unto thine own understanding.', 
    source = 'Proverbs 3:5' 
  } = $props();

  let sectionRef = $state(null);
  let ctx;

  // Cursor interaction states
  let isMobile = $state(false);
  let mouseX = $state(0);
  let mouseY = $state(0);
  let isHovered = $state(false);
  let tiltX = $state(0);
  let tiltY = $state(0);

  function handleMouseMove(event) {
    if (isMobile) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mouseX = x;
    mouseY = y;
    isHovered = true;

    // 3D Tilt calculation (max 6 degrees tilt)
    const relativeX = (x / rect.width) - 0.5;
    const relativeY = (y / rect.height) - 0.5;
    tiltX = -relativeY * 7;
    tiltY = relativeX * 7;
  }

  function handleMouseLeave() {
    if (isMobile) return;
    isHovered = false;
    tiltX = 0;
    tiltY = 0;
  }

  const processSegments = (text) => {
    if (!text) return [];
    return text.split(' ').map(word => {
      const segments = [];
      if (word.includes('{highlight}')) {
        const parts = word.split('{highlight}');
        parts.forEach((part, i) => {
          if (part) segments.push({ text: part, isHighlighted: false });
          if (i < parts.length - 1) {
            segments.push({ text: highlightedWord, isHighlighted: true });
          }
        });
      } else {
        // Strip out punctuation for matching to ensure robust highlights (e.g. "LORD," matches "LORD")
        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
        const cleanHighlight = highlightedWord.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
        const isMatch = cleanWord.toLowerCase() === cleanHighlight.toLowerCase();
        segments.push({ text: word, isHighlighted: isMatch });
      }
      return segments;
    });
  };

  let processedQuote = $derived(processSegments(quote));
  let processedSubQuote = $derived(processSegments(subQuote));

  onMount(() => {
    if (!browser || !sectionRef) return;

    isMobile = window.innerWidth < 768 || matchMedia('(pointer: coarse)').matches;

    ctx = gsap.context(() => {
      if (isMobile) {
        // MOBILE HIGH-PERFORMANCE EXPERIENCE: simple fade & slide up for the whole card at once
        gsap.fromTo('.fq-card',
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef, start: 'top 80%' }
          }
        );
        return;
      }

      // DESKTOP ADVANCED CINEMATIC EXPERIENCE
      // Dynamic spotlight orbs parallax
      gsap.to('.fq-orb-1', {
        yPercent: -40,
        xPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });
      gsap.to('.fq-orb-2', {
        yPercent: -20,
        xPercent: -15,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });

      // Monogram rotates elegantly on scroll
      gsap.to('.fq-monogram', {
        rotation: 360,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef, start: 'top bottom', end: 'bottom top', scrub: 1.8 }
      });

      // Architectural border corner brackets fade and snap in
      gsap.fromTo('.fq-corner', { scale: 0.85, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 1.6, ease: 'power4.out', stagger: 0.08,
        scrollTrigger: { trigger: sectionRef, start: 'top 85%' }
      });

      // Monolith Glass Card reveal
      gsap.fromTo('.fq-card', { opacity: 0, y: 40, scale: 0.98 }, {
        opacity: 1, y: 0, scale: 1, duration: 1.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef, start: 'top 85%' }
      });

      // Main cinematic quote reveal
      const chars = gsap.utils.toArray('.fq-char');
      if (chars.length > 0) {
        gsap.fromTo(chars,
          { opacity: 0, y: 20, scale: 1.08 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 1.4, stagger: { each: 0.012, from: 'start' }, ease: 'power4.out',
            scrollTrigger: { trigger: sectionRef, start: 'top 80%' }
          }
        );
      }

      // Custom light-ray divider line wipe
      gsap.fromTo('.fq-divider', { scaleX: 0 }, {
        scaleX: 1, duration: 1.4, delay: 0.3, ease: 'power4.inOut',
        scrollTrigger: { trigger: sectionRef, start: 'top 80%' }
      });

      // Sub-quote text lines reveal
      gsap.fromTo('.fq-sub', { opacity: 0, y: 15 }, {
        opacity: 1, y: 0, duration: 1.3, delay: 0.5, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef, start: 'top 80%' }
      });

      // Refresh ScrollTrigger to ensure accuracy
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

    }, sectionRef);

    return () => {
      if (ctx) ctx.revert();
    };
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap" rel="stylesheet">
</svelte:head>

<!-- Interactive Spotlight Container -->
<section
  bind:this={sectionRef}
  onmousemove={handleMouseMove}
  onmouseleave={handleMouseLeave}
  aria-label="Foundational Quote"
  class="fq-section relative py-32 md:py-48 lg:py-56 overflow-hidden flex flex-col items-center justify-center text-center px-4 sm:px-6 bg-background transition-colors duration-1000 select-none"
  style="--x: {mouseX}px; --y: {mouseY}px; --tilt-x: {tiltX}deg; --tilt-y: {tiltY}deg; --spotlight-opacity: {isHovered ? 1 : 0};"
>
  <!-- Background Ambient Glow Aura -->
  <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <!-- Active Mouse Spotlight Halo -->
    <div class="absolute inset-0 opacity-100 transition-opacity duration-700 spotlight-halo"></div>
    
    <!-- Floating Cinematic Orbs -->
    <div class="fq-orb-1 absolute -top-24 -left-20 w-[40vw] h-[40vw] rounded-full blur-[140px] pointer-events-none opacity-20 dark:opacity-[0.12]"></div>
    <div class="fq-orb-2 absolute -bottom-24 -right-20 w-[35vw] h-[35vw] rounded-full blur-[120px] pointer-events-none opacity-[0.15] dark:opacity-[0.08]"></div>
    
    <!-- Sparse Geometric Dot Grid -->
    <div class="absolute inset-0 opacity-15 dark:opacity-20 flex justify-center items-center">
      <div class="w-full h-full" 
           style="background-image: radial-gradient(var(--accent) 1px, transparent 1px); background-size: 2.5rem 2.5rem; mask-image: radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%); -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%);">
      </div>
    </div>
  </div>

  <!-- Perspective Wrapper -->
  <div class="perspective-container z-10 w-full max-w-4xl px-2">
    <!-- Glass Architectural Card -->
    <div class="fq-card tilt-card glass-panel w-full relative py-16 md:py-24 px-6 md:px-12 border border-border/40 rounded-3xl overflow-hidden shadow-2xl">
      <!-- Active Card Highlight Reflection -->
      <div class="absolute inset-0 pointer-events-none transition-opacity duration-500 card-reflection opacity-[var(--spotlight-opacity)]"></div>

      <!-- Corner Brackets -->
      <div class="fq-corner absolute top-5 left-5 w-5 h-5 border-t border-l border-accent/30 rounded-tl-sm pointer-events-none"></div>
      <div class="fq-corner absolute top-5 right-5 w-5 h-5 border-t border-r border-accent/30 rounded-tr-sm pointer-events-none"></div>
      <div class="fq-corner absolute bottom-5 left-5 w-5 h-5 border-b border-l border-accent/30 rounded-bl-sm pointer-events-none"></div>
      <div class="fq-corner absolute bottom-5 right-5 w-5 h-5 border-b border-r border-accent/30 rounded-br-sm pointer-events-none"></div>

      <!-- Card Content Inner Depth -->
      <div class="inner-depth relative z-10 flex flex-col items-center">
        <!-- Monogram Eyebrow Spinner -->
        <div class="fq-monogram mb-8 md:mb-10 w-10 h-10 flex items-center justify-center rounded-full border border-accent/20 bg-background/40 backdrop-blur-md">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-accent">
            <path d="M12 2V22" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M2 12H22" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 2"/>
          </svg>
        </div>

        <span class="fq-sub text-[10px] font-sans font-bold text-accent tracking-[0.3em] uppercase mb-6 block">
          FOUNDATION
        </span>

        <!-- Main Cinematic Quote -->
        <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] text-foreground leading-[1.35] md:leading-[1.25] mb-0 flex flex-wrap justify-center gap-x-[0.28em] gap-y-[0.2em] max-w-3xl mx-auto font-light">
          {#each processedQuote as wordSegments, wordIdx (wordIdx)}
            <span class="inline-block whitespace-nowrap overflow-visible">
              {#each wordSegments as segment, segIdx}
                {#each segment.text.split('') as char, charIdx}
                  <span
                    class="fq-char inline-block transition-all duration-300 {segment.isHighlighted ? 'text-accent font-medium text-glow' : 'font-light text-foreground/80'}"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                {/each}
              {/each}
            </span>
          {/each}
        </h2>

        <!-- Custom Gold-Ray Divider -->
        <div class="fq-divider w-24 md:w-36 h-[2px] my-10 md:my-12 origin-center bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

        <!-- Elegant Sub-Quote -->
        {#if subQuote}
          <p class="fq-sub font-serif italic text-lg md:text-xl text-foreground/70 leading-relaxed max-w-xl mx-auto mb-10 md:mb-12">
            {#each processedSubQuote as wordSegments, wordIdx (wordIdx)}
              <span class="inline-block">
                {#each wordSegments as segment}
                  <span class={segment.isHighlighted ? 'text-accent/90 font-medium not-italic text-glow-sub' : ''}>
                    {segment.text}
                  </span>
                {/each}
                &nbsp;
              </span>
            {/each}
          </p>
        {/if}

        <!-- Cinematic Attribution -->
        {#if source}
          <div class="fq-sub flex items-center group cursor-default">
            <div class="h-px w-6 bg-accent/25 group-hover:w-10 transition-all duration-700"></div>
            <span class="px-4 text-[10px] font-sans font-bold text-foreground/60 tracking-[0.25em] uppercase transition-colors group-hover:text-accent duration-500">
              {source}
            </span>
            <div class="h-px w-6 bg-accent/25 group-hover:w-10 transition-all duration-700"></div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .font-serif {
    font-family: 'Cormorant Garamond', serif;
  }

  .fq-char {
    display: inline-block;
  }

  /* 3D Perspective Card Tilt styling */
  .perspective-container {
    perspective: 1200px;
    transform-style: preserve-3d;
  }

  .tilt-card {
    transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateZ(0);
    transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease, border-color 0.3s ease;
    will-change: transform;
    transform-style: preserve-3d;
  }

  .inner-depth {
    transform: translateZ(35px);
    transform-style: preserve-3d;
  }

  /* Glow effects for highlighted text */
  .text-glow {
    text-shadow: 0 0 25px rgba(212, 176, 85, 0.25), 
                 0 0 50px rgba(212, 176, 85, 0.15);
  }
  
  :global(html[data-theme="light"]) .text-glow {
    text-shadow: 0 0 25px rgba(184, 146, 48, 0.2), 
                 0 0 50px rgba(184, 146, 48, 0.1);
  }
  
  .text-glow-sub {
    text-shadow: 0 0 15px rgba(212, 176, 85, 0.15);
  }

  :global(html[data-theme="light"]) .text-glow-sub {
    text-shadow: 0 0 15px rgba(184, 146, 48, 0.1);
  }

  /* Interactive Background Orbs */
  .fq-orb-1 {
    background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
  }

  .fq-orb-2 {
    background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
  }

  /* Custom Spotlight Hover Effect */
  .spotlight-halo {
    background: radial-gradient(
      600px circle at var(--x, 0px) var(--y, 0px),
      color-mix(in srgb, var(--accent) calc(var(--spotlight-opacity, 0) * 8%), transparent) 0%,
      transparent 75%
    );
  }

  .card-reflection {
    background: radial-gradient(
      400px circle at var(--x, 0px) var(--y, 0px),
      rgba(255, 255, 255, 0.04) 0%,
      transparent 60%
    );
  }

  :global(html[data-theme="light"]) .card-reflection {
    background: radial-gradient(
      400px circle at var(--x, 0px) var(--y, 0px),
      rgba(0, 0, 0, 0.02) 0%,
      transparent 60%
    );
  }

  /* Card styling */
  .fq-card {
    background-color: var(--glass-bg);
    border-color: var(--glass-border);
    box-shadow: 0 10px 40px 0 var(--glass-shadow);
  }
</style>
