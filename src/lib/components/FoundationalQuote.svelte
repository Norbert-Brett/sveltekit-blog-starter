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
        // Simple word match check (stripping punctuation for match if needed, but following Vue exactly)
        const isMatch = word === highlightedWord;
        segments.push({ text: word, isHighlighted: isMatch });
      }
      return segments;
    });
  };

  // Svelte 5 derived or simple transform
  let processedQuote = $derived(processSegments(quote));
  let processedSubQuote = $derived(processSegments(subQuote));

  onMount(() => {
    if (!browser || !sectionRef) return;

    ctx = gsap.context(() => {
      // Ambient orb parallax
      gsap.to('.fq-orb', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });

      // Cross icon rotates
      gsap.to('.fq-cross', {
        rotation: 360,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef, start: 'top bottom', end: 'bottom top', scrub: 2 }
      });

      // Decorative corner lines
      gsap.fromTo('.fq-corner-line', { scaleX: 0, scaleY: 0 }, {
        scaleX: 1, scaleY: 1, duration: 1.4, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef, start: 'top 85%' }
      });

      // Main cinematic reveal
      const chars = gsap.utils.toArray('.fq-char');
      if (chars.length > 0) {
        gsap.fromTo(chars,
          { opacity: 0, filter: 'blur(12px)', y: 20, scale: 1.05 },
          {
            opacity: 1, filter: 'blur(0px)', y: 0, scale: 1,
            duration: 1.2, stagger: { each: 0.015, from: 'start' }, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef, start: 'top 85%' }
          }
        );
      }

      // Divider line
      gsap.fromTo('.fq-divider', { scaleX: 0 }, {
        scaleX: 1, duration: 1.2, delay: 0.4, ease: 'power4.inOut',
        scrollTrigger: { trigger: sectionRef, start: 'top 85%' }
      });

      // Sub-quote and attribution
      gsap.fromTo('.fq-sub', { opacity: 0, y: 15 }, {
        opacity: 1, y: 0, duration: 1.2, delay: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef, start: 'top 85%' }
      });

      // Measurement refresh
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
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap" rel="stylesheet">
</svelte:head>

<section
  bind:this={sectionRef}
  class="fq-section relative py-40 md:py-56 lg:py-64 overflow-hidden flex flex-col items-center justify-center text-center px-6 bg-black"
>
  <!-- Background Layers -->
  <div class="absolute inset-0 z-1 pointer-events-none"></div>

  <!-- Unified Architectural Dot Grid (Sparse) -->
  <div class="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-20">
    <div class="w-full h-full" 
         style="background-image: radial-gradient(var(--color-primary) 1.5px, transparent 1.5px); background-size: 3rem 3rem; mask-image: radial-gradient(ellipse at 50% 50%, black 15%, transparent 75%); -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 15%, transparent 75%);">
    </div>
  </div>



  <!-- Content -->
  <div class="relative z-10 max-w-5xl w-full flex flex-col items-center">
    <!-- Cross Icon -->
    <div class="fq-cross mb-10 md:mb-14 opacity-60">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-primary">
        <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="1"/>
        <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1"/>
      </svg>
    </div>

    <!-- Eyebrow -->
    <span class="fq-sub text-[10px] font-sans font-semibold text-primary/70 tracking-widest uppercase mb-10 md:mb-14 block">
      Foundation
    </span>

    <!-- Main Quote -->
    <h2 class="fq-quote font-serif text-3xl md:text-5xl lg:text-[3.8rem] text-white/90 leading-[1.45] md:leading-[1.35] mb-0 flex flex-wrap justify-center gap-x-[0.3em] gap-y-[0.25em] max-w-4xl mx-auto">
      {#each processedQuote as wordSegments, wordIdx (wordIdx)}
        <span class="inline-block whitespace-nowrap overflow-visible">
          {#each wordSegments as segment, segIdx}
            {#each segment.text.split('') as char, charIdx}
              <span
                class="fq-char inline-block {segment.isHighlighted ? 'text-primary font-medium' : 'font-extralight text-white/80'}"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            {/each}
          {/each}
        </span>
      {/each}
    </h2>

    <div class="fq-divider w-24 md:w-40 h-px my-12 md:my-16 origin-center bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>

    <!-- Sub-Quote -->
    {#if subQuote}
      <p class="fq-sub font-serif italic text-base md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-14 md:mb-16">
        {#each processedSubQuote as wordSegments, wordIdx (wordIdx)}
          <span class="inline-block">
            {#each wordSegments as segment}
              <span class={segment.isHighlighted ? 'text-primary/80 font-medium not-italic' : ''}>
                {segment.text}
              </span>
            {/each}
            &nbsp;
          </span>
        {/each}
      </p>
    {/if}

    <!-- Source -->
    {#if source}
      <div class="fq-sub flex items-center group cursor-default">
        <div class="h-px w-8 bg-primary/20 group-hover:w-12 transition-all duration-700"></div>
        <span class="px-5 text-xs font-sans font-semibold text-white/70 tracking-widest uppercase transition-colors group-hover:text-primary">
          {source}
        </span>
        <div class="h-px w-8 bg-primary/20 group-hover:w-12 transition-all duration-700"></div>
      </div>
    {/if}
  </div>
</section>

<style>
  .font-serif {
    font-family: 'Cormorant Garamond', serif;
  }

  .fq-char {
    display: inline-block;
    will-change: transform, filter, opacity;
  }

  .text-primary {
    text-shadow: 0 0 40px color-mix(in srgb, var(--primary), transparent 70%), 0 0 80px color-mix(in srgb, var(--primary), transparent 90%);
  }
</style>
