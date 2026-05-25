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
  
  // Spotlight coordinates state
  let footerMouseX = $state(0);
  let footerMouseY = $state(0);
  let footerIsHovered = $state(false);

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

  function handleFooterMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    footerMouseX = e.clientX - rect.left;
    footerMouseY = e.clientY - rect.top;
    footerIsHovered = true;
  }

  function handleFooterMouseLeave() {
    footerIsHovered = false;
  }

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
      // 1. CTA label reveal
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

      // 2. Custom Vertical Divider Lines slide-down reveals (high-end architectural detail)
      gsap.fromTo('.footer-border-line', 
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.6,
          ease: 'power3.inOut',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.footer-grid',
            start: 'top 95%'
          }
        }
      );

      // 3. Grid columns — staggered fade up
      gsap.fromTo('.footer-col', 
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2, 
          stagger: 0.15, 
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.footer-grid',
            start: 'top 95%',
          }
        }
      );

      // 4. Social Links stagger
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
  onmousemove={handleFooterMouseMove}
  onmouseleave={handleFooterMouseLeave}
  aria-label="Footer"
  class="relative bg-background text-foreground pt-32 pb-0 overflow-hidden border-t border-border/50 select-none transition-colors duration-1000"
  style="--footer-x: {footerMouseX}px; --footer-y: {footerMouseY}px; --footer-spotlight-opacity: {footerIsHovered ? 1 : 0};"
>
  <!-- Background Liquid Spotlight & Subtle Orbs -->
  <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div class="absolute inset-0 opacity-100 transition-opacity duration-700 footer-spotlight"></div>
    <div class="absolute bottom-0 left-1/4 w-[50vw] h-[30vw] bg-accent/5 rounded-full blur-[130px] pointer-events-none opacity-40 dark:opacity-20"></div>
  </div>

  <!-- Giant CTA "Let's Work Together" -->
  <div class="footer-cta max-w-7xl mx-auto px-6 mb-24 relative z-10">
    <div class="flex flex-col items-start">
      <p class="footer-cta-label text-accent font-semibold font-sans text-xs tracking-[0.25em] uppercase mb-6 flex items-center gap-2">
        <span class="w-1.5 h-1.5 bg-accent rounded-full animate-ping"></span>
        <span class="w-1.5 h-1.5 bg-accent rounded-full absolute"></span>
        OPEN FOR OPPORTUNITIES
      </p>

      <a href="mailto:norbertbrett@outlook.com" class="group/cta relative block w-full interactive">
        <h3
          class="footer-cta-text text-[10vw] md:text-[8vw] leading-none font-bold tracking-tight pb-4 group-[.group]/cta:text-foreground"
        >
          <!-- Character mask reveal + wave stagger hover delay -->
          <span class="block pt-2">
            {#each ctaLine1.split('') as char, i}
              <span 
                class="cta-char inline-block will-change-transform text-foreground/20 group-hover/cta:text-foreground group-hover/cta:-translate-y-1 transition-all duration-500 {char === ' ' ? 'w-[0.3em]' : ''}"
                style="transition-delay: {i * 20}ms"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            {/each}
          </span>
          <span class="block pt-1">
            <span class="inline-block ml-[5vw] group-hover/cta:ml-[7vw] transition-all duration-700">
              {#each ctaLine2.split('') as char, i}
                <span 
                  class="cta-char inline-block will-change-transform text-foreground/20 group-hover/cta:text-accent group-hover/cta:-translate-y-1 transition-all duration-500"
                  style="transition-delay: {(ctaLine1.length + i) * 20}ms"
                >
                  {char}
                </span>
              {/each}
            </span>
          </span>
        </h3>

        <!-- Magnetic Premium Gold Arrow Circle -->
        <div
          use:magnetic={{ strength: 0.6, textStrength: 0.2 }}
          class="footer-arrow-circle absolute top-1/2 right-[5%] -translate-y-1/2 hidden md:flex w-24 h-24 bg-accent text-background rounded-full items-center justify-center group-hover/cta:scale-110 group-hover/cta:rotate-45 transition-all duration-500 shadow-[0_0_40px_rgba(212,176,85,0.35)] interactive border border-accent/20 overflow-hidden"
        >
          <!-- Internal Hover Ripple -->
          <div class="absolute inset-0 bg-background scale-0 group-hover/cta:scale-100 transition-transform duration-700 rounded-full ease-out opacity-15"></div>
          <!-- Concentric Ring -->
          <div class="absolute w-full h-full rounded-full border border-accent/20 animate-ping opacity-30 pointer-events-none"></div>
          
          <span class="magnetic-text flex items-center justify-center relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
          </span>
        </div>
      </a>
    </div>
  </div>

  <!-- Outlined Kinetic Ticker Tape (Marquee) -->
  <div class="w-full border-t border-border/40 py-4 bg-background/30 backdrop-blur-md overflow-hidden relative z-10">
    <div class="flex whitespace-nowrap" style="--duration: 35s; --gap: 3rem;">
      <div class="animate-marquee flex shrink-0 min-w-full justify-around text-[10px] font-sans font-bold tracking-[0.25em] text-accent uppercase" style="gap: var(--gap);">
        <span>* NORBERT BRETT *</span>
        <span>CRAFTING DIGITAL MASTERPIECES</span>
        <span>* AVAILABLE FOR WORK *</span>
        <span>DEVELOPING IN BUDAPEST, HU</span>
        <span>* PORTFOLIO 2026 *</span>
      </div>
      <div class="aria-hidden animate-marquee flex shrink-0 min-w-full justify-around text-[10px] font-sans font-bold tracking-[0.25em] text-accent uppercase" style="gap: var(--gap);">
        <span>* NORBERT BRETT *</span>
        <span>CRAFTING DIGITAL MASTERPIECES</span>
        <span>* AVAILABLE FOR WORK *</span>
        <span>DEVELOPING IN BUDAPEST, HU</span>
        <span>* PORTFOLIO 2026 *</span>
      </div>
    </div>
  </div>

  <!-- Footer grid panel with custom wipes -->
  <div class="footer-grid border-t border-border/40 relative z-10">
    <div class="max-w-7xl mx-auto px-6 relative">
      <!-- Custom vertical desktop lines revealed via GSAP scaleY -->
      <div class="footer-border-line absolute top-0 left-[33.33%] w-px h-full bg-border/40 origin-top hidden md:block"></div>
      <div class="footer-border-line absolute top-0 left-[66.66%] w-px h-full bg-border/40 origin-top hidden md:block"></div>

      <div class="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 divide-border/40 relative">

        <!-- Col 1: Brand, Time & Map Wireframe -->
        <div class="footer-col md:col-span-4 py-16 md:pr-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden">
          <!-- Abstract Budapest River Map Bend -->
          <div class="absolute -right-4 bottom-4 w-40 h-28 opacity-10 dark:opacity-[0.06] pointer-events-none select-none">
            <svg width="160" height="110" viewBox="0 0 160 110" fill="none" class="text-accent">
              <line x1="0" y1="20" x2="160" y2="20" stroke="currentColor" stroke-width="0.5" stroke-dasharray="1 3"/>
              <line x1="0" y1="55" x2="160" y2="55" stroke="currentColor" stroke-width="0.5" stroke-dasharray="1 3"/>
              <line x1="0" y1="90" x2="160" y2="90" stroke="currentColor" stroke-width="0.5" stroke-dasharray="1 3"/>
              <line x1="40" y1="0" x2="40" y2="110" stroke="currentColor" stroke-width="0.5" stroke-dasharray="1 3"/>
              <line x1="80" y1="0" x2="80" y2="110" stroke="currentColor" stroke-width="0.5" stroke-dasharray="1 3"/>
              <line x1="120" y1="0" x2="120" y2="110" stroke="currentColor" stroke-width="0.5" stroke-dasharray="1 3"/>
              <path d="M 80,0 Q 82,30 90,55 T 100,110" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M 82,0 Q 84,30 92,55 T 102,110" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" opacity="0.5"/>
              <circle cx="90" cy="55" r="3" fill="currentColor" class="animate-ping"/>
              <circle cx="90" cy="55" r="1.5" fill="currentColor"/>
              <text x="96" y="58" font-family="JetBrains Mono" font-size="6.5" fill="currentColor" letter-spacing="0.5" font-weight="bold">47.4979° N</text>
            </svg>
          </div>

          <div>
            <h3 class="font-bold text-2xl tracking-tight mb-3 text-foreground">{siteTitle}</h3>
            <p class="text-foreground/60 text-sm max-w-xs leading-relaxed">
              Full Stack Developer crafting digital experiences with precision and passion.
            </p>
          </div>

          <div class="flex flex-col gap-6 mt-12 relative z-10">
            <div class="font-sans">
              <p class="text-foreground/35 font-bold mb-2 tracking-[0.2em] uppercase text-[9px] flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-pulse"></span>
                LOCAL TIME (YOU)
              </p>
              <p class="text-2xl text-foreground/90 font-light tracking-tight tabular-nums font-mono">{localTime}</p>
            </div>
            <div class="font-sans">
              <p class="text-accent font-bold mb-2 tracking-[0.2em] uppercase text-[9px] flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 bg-accent rounded-full animate-ping"></span>
                <span class="w-1.5 h-1.5 bg-accent rounded-full absolute"></span>
                BUDAPEST, HU (ME)
              </p>
              <p class="text-2xl text-foreground font-light tracking-tight tabular-nums font-mono">{budapestTime}</p>
            </div>
          </div>
        </div>

        <!-- Col 2: Navigation -->
        <div class="footer-col footer-nav md:col-span-4 py-16 md:px-8 flex flex-col justify-between min-h-[300px]">
          <nav class="flex flex-col gap-3" aria-label="Footer Navigation">
            <p class="font-sans text-[10px] font-bold text-foreground/40 mb-4 tracking-[0.25em] uppercase">MENU</p>
            <a href="/" class="footer-nav-link group text-xl font-medium text-foreground/80 hover:text-foreground hover:translate-x-2 transition-all duration-300 tracking-tight relative interactive">
              <span class="relative z-10 flex items-center gap-2">
                Home
                <span class="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </span>
            </a>
            {#each navItems as item (item.route)}
              <a
                href={item.route}
                class="footer-nav-link group text-xl font-medium text-foreground/80 hover:text-foreground hover:translate-x-2 transition-all duration-300 tracking-tight relative interactive"
              >
                <span class="relative z-10 flex items-center gap-2">
                  {item.title}
                  <span class="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </span>
              </a>
            {/each}
          </nav>
        </div>

        <!-- Col 3: Socials -->
        <div class="footer-col md:col-span-4 py-16 md:pl-8 flex flex-col justify-between min-h-[300px]">
          <div class="social-links flex flex-col gap-4">
            <p class="font-sans text-[10px] font-bold text-foreground/40 mb-3 tracking-[0.25em] uppercase">SOCIALS</p>
            <nav aria-label="Social Media Links">
              {#each socialLinks as social (social.label)}
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-link group flex items-center justify-between border-b border-border/30 pb-3 mb-1 hover:border-accent transition-all duration-500 interactive overflow-hidden"
                >
                  <span class="text-sm font-medium text-foreground/60 group-hover:text-foreground transition-colors font-sans tracking-wide">{social.display}</span>
                  <div class="relative w-4 h-4 overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-foreground/40 group-hover:text-accent transition-all duration-300 group-hover:-translate-y-full group-hover:translate-x-full"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute top-full -left-full w-4 h-4 text-accent transition-all duration-300 group-hover:-translate-y-full group-hover:translate-x-full"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  </div>
                </a>
              {/each}
            </nav>
          </div>

          <div class="flex justify-end pt-8">
            <button onclick={scrollToTop}
              aria-label="Back to top"
              class="group flex items-center gap-3 text-[10px] font-sans font-bold text-foreground/60 hover:text-accent transition-colors interactive tracking-[0.25em] uppercase"
            >
              Back to top
              <div
                class="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500 group-hover:-translate-y-1 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 group-hover:text-background transition-colors"><path d="m18 15-6-6-6 6"/></svg>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Copyright Bar -->
  <div class="border-t border-border/30 relative z-10 bg-background/20 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-sans text-foreground/40 tracking-[0.1em] uppercase font-semibold gap-3">
      <p>&copy; {currentYear} {siteTitle}. All rights reserved.</p>
      <p>Designed & Developed in Budapest, HU</p>
    </div>
  </div>
</footer>

<style>
  /* Custom Spotlight Hover Effect */
  .footer-spotlight {
    background: radial-gradient(
      800px circle at var(--footer-x, 0px) var(--footer-y, 0px),
      color-mix(in srgb, var(--accent) calc(var(--footer-spotlight-opacity, 0) * 5.5%), transparent) 0%,
      transparent 80%
    );
  }

  /* GSAP handles GPU promotion during animation via force3D */
</style>
