<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { siteTitle, navItems } from '$lib/config';
  import { magnetic } from '$lib/actions/magnetic.js';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Svelte 5 runes
  let localTime = $state('Loading...');
  let budapestTime = $state('Loading...');
  let footerRef = $state(null);
  let timer;
  let ctx;

  const updateTime = () => {
    const now = new Date();
    localTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
      hour12: false
    }).format(now);
    
    budapestTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Europe/Budapest',
      timeZoneName: 'short',
      hour12: false
    }).format(now);
  };

  const scrollToTop = () => {
    if (!browser) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/norbert-brett', display: 'LinkedIn' },
    { label: 'GitHub', href: 'https://github.com/Norbert-Brett', display: 'GitHub' },
    { label: 'Twitter', href: 'https://twitter.com/norbert_brett', display: 'Twitter / X' },
    { label: 'Email', href: 'mailto:norbertbrett@outlook.com', display: 'Email' }
  ];

  const currentYear = new Date().getFullYear();

  // Split "Let's work together" into characters for mask reveal
  const ctaLine1 = "Let's work";
  const ctaLine2 = "together";

  onMount(() => {
    updateTime();
    timer = setInterval(updateTime, 1000);

    ctx = gsap.context(() => {
      // 1. CTA character-by-character mask reveal (cinematic)
      gsap.fromTo('.footer-cta-label',
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'expo.out',
          scrollTrigger: { trigger: '.footer-cta', start: 'top 90%' }
        }
      );

      // Character entrance: mask-up + settle (initial impact)
      const ctaChars = gsap.utils.toArray('.cta-char');
      if (ctaChars.length > 0) {
        gsap.fromTo(ctaChars,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0, opacity: 1,
            duration: 1.2,
            stagger: 0.02,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: '.footer-cta',
              start: 'top 95%',
            }
          }
        );
      }

      // Arrow circle entrance
      gsap.fromTo('.footer-arrow-circle',
        { scale: 0, opacity: 0, rotate: -45 },
        {
          scale: 1, opacity: 1, rotate: 0,
          duration: 0.8, ease: 'back.out(1.7)', delay: 0.3,
          scrollTrigger: { trigger: '.footer-cta', start: 'top 85%' }
        }
      );

      // No GSAP color scrub — using CSS group-hover for reliable cross-page hover

      // 2. Grid columns — staggered line-wipe reveals
      gsap.fromTo('.footer-col', 
        { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0 0% 0)', opacity: 1,
          duration: 1, 
          stagger: 0.15, 
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.footer-grid',
            start: 'top 95%',
          }
        }
      );

      // 3. Social Links stagger
      gsap.fromTo('.social-link', 
        { opacity: 0, x: -15 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.footer-grid',
            start: 'top 90%',
          }
        }
      );

      // Footer nav links stagger
      gsap.fromTo('.footer-nav-link', 
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.footer-grid',
            start: 'top 90%',
          }
        }
      );
    }, footerRef);
  });

  onDestroy(() => {
    if (browser) {
      clearInterval(timer);
      if (ctx) ctx.revert();
    }
  });
</script>

<footer
  bind:this={footerRef}
  class="relative bg-background text-white pt-32 pb-0 overflow-hidden border-t border-white/10"
>
  <!-- Von Restorff: "Let's Work Together" is massive, visually isolated CTA -->
  <div class="footer-cta max-w-7xl mx-auto px-6 mb-32 relative z-10">
    <div class="flex flex-col items-start">
      <p class="footer-cta-label text-white/50 font-medium font-sans text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
        <span class="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse"></span>
        Open for Opportunities
      </p>

      <a href="mailto:norbertbrett@outlook.com" class="group/cta relative block w-full interactive">
        <h3
          class="footer-cta-text text-[10vw] md:text-[8vw] leading-none font-bold tracking-tight pb-4 group-[.group]/cta:text-foreground"
        >
          <!-- Character mask reveal -->
          <span class="block pt-2">
            {#each ctaLine1.split('') as char, i}
              <span class="cta-char inline-block will-change-transform text-foreground/15 group-hover/cta:text-foreground transition-colors duration-700 {char === ' ' ? 'w-[0.3em]' : ''}">{char === ' ' ? '\u00A0' : char}</span>
            {/each}
          </span>
          <span class="block pt-1">
            <span class="inline-block ml-[5vw] group-hover/cta:ml-[7vw] transition-all duration-500">
              {#each ctaLine2.split('') as char, i}
                <span class="cta-char inline-block will-change-transform text-foreground/15 group-hover/cta:text-foreground transition-colors duration-700">{char}</span>
              {/each}
            </span>
          </span>
        </h3>

        <!-- Magnetic arrow circle -->
        <div
          use:magnetic={{ strength: 0.6, textStrength: 0.2 }}
          class="footer-arrow-circle absolute top-1/2 right-[5%] -translate-y-1/2 hidden md:flex w-20 h-20 bg-white text-black rounded-full items-center justify-center group-hover:scale-110 group-hover:rotate-45 transition-all duration-500 shadow-2xl interactive"
        >
          <span class="magnetic-text flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
          </span>
        </div>
      </a>
    </div>
  </div>

  <!-- Jakob's Law: Standard brand/nav/social 3-column footer pattern -->
  <div class="footer-grid border-t border-white/5 relative z-10">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/5">

        <!-- Col 1: Brand & Time -->
        <div class="footer-col md:col-span-4 py-12 md:pr-8 flex flex-col justify-between min-h-[280px]">
          <div>
            <h3 class="font-bold text-2xl tracking-tight mb-2 text-white">{siteTitle}</h3>
            <p class="text-white/60 text-sm max-w-xs leading-relaxed">
              Full Stack Developer crafting digital experiences with precision and passion.
            </p>
          </div>

          <div class="flex flex-col gap-6 mt-12">
            <div class="font-sans">
              <p class="text-white/30 font-semibold mb-2 tracking-widest uppercase text-[10px]">Local Time (You)</p>
              <p class="text-2xl text-white tabular-nums font-sans font-light tracking-tight">{localTime}</p>
            </div>
            <div class="font-sans">
              <p class="text-white/30 font-semibold mb-2 tracking-widest uppercase text-[10px]">Budapest, HU (Me)</p>
              <p class="text-2xl text-white/90 tabular-nums font-sans font-light tracking-tight">{budapestTime}</p>
            </div>
          </div>
        </div>

        <!-- Col 2: Navigation -->
        <div class="footer-col footer-nav md:col-span-4 py-12 md:px-8 flex flex-col justify-between min-h-[280px]">
          <nav class="flex flex-col gap-3" aria-label="Footer Navigation">
            <p class="font-sans text-xs font-semibold text-white/40 mb-3 tracking-widest uppercase">Menu</p>
            <a href="/" class="footer-nav-link group text-xl font-medium text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300 tracking-tight relative interactive">
              <span class="relative z-10">Home</span>
            </a>
            {#each navItems as item (item.route)}
              <a
                href={item.route}
                class="footer-nav-link group text-xl font-medium text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300 tracking-tight relative interactive"
              >
                <span class="relative z-10">{item.title}</span>
              </a>
            {/each}
          </nav>
        </div>

        <!-- Col 3: Socials -->
        <div class="footer-col md:col-span-4 py-12 md:pl-8 flex flex-col justify-between min-h-[280px]">
          <div class="social-links flex flex-col gap-4">
            <p class="font-sans text-xs font-semibold text-white/40 mb-2 tracking-widest uppercase">Socials</p>
            <nav aria-label="Social Media Links">
              {#each socialLinks as social (social.label)}
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-link group flex items-center justify-between border-b border-white/10 pb-3 mb-1 hover:border-white transition-all duration-300 interactive overflow-hidden"
                >
                  <span class="text-sm font-medium text-white/60 group-hover:text-white transition-colors font-sans tracking-wide">{social.display}</span>
                  <div class="relative w-4 h-4 overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-white/40 group-hover:text-white transition-all duration-300 group-hover:-translate-y-full group-hover:translate-x-full"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute top-full -left-full w-4 h-4 text-white transition-all duration-300 group-hover:-translate-y-full group-hover:translate-x-full"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  </div>
                </a>
              {/each}
            </nav>
          </div>

          <div class="flex justify-end pt-8">
            <button onclick={scrollToTop}
              aria-label="Back to top"
              class="group flex items-center gap-2 text-xs font-sans font-medium text-white/60 hover:text-white transition-colors interactive tracking-widest uppercase"
            >
              Back to top
              <div
                class="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300 group-hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:text-black transition-colors"><path d="m18 15-6-6-6 6"/></svg>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Copyright -->
  <div class="border-t border-white/10 relative z-10">
    <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs font-sans text-white/40 tracking-wide">
      <p>&copy; {currentYear} {siteTitle}. All rights reserved.</p>
      <p>Designed & Developed in Budapest, HU</p>
    </div>
  </div>
</footer>

<style>
  :global(.text-stroke-white) {
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
  }
  .cta-char {
    will-change: transform, opacity;
  }
  .footer-col {
    will-change: clip-path, opacity;
  }
</style>
