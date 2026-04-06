<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { siteTitle, navItems } from '$lib/config';
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

  onMount(() => {
    updateTime();
    timer = setInterval(updateTime, 1000);

    ctx = gsap.context(() => {
      // CTA Animations
      gsap.fromTo('.footer-cta-el', 
        { y: 40, opacity: 0 },
        {
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.1, 
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.footer-cta',
            start: 'top 90%',
          }
        }
      );

      // Grid Animations
      gsap.fromTo('.footer-col', 
        { y: 30, opacity: 0 },
        {
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.footer-grid',
            start: 'top 95%',
          }
        }
      );

      // Social Links & Nav
      gsap.fromTo(['.social-link', '.footer-nav-link'], 
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
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
  <!-- Large CTA Section -->
  <div class="footer-cta max-w-7xl mx-auto px-6 mb-32 relative z-10">
    <div class="flex flex-col items-start">
      <p class="footer-cta-el text-primary font-medium font-mono text-xs tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
        <span class="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-pulse"></span>
        Open for Opportunities
      </p>

      <a href="mailto:norbertbrett@outlook.com" class="group relative block w-full interactive">
        <h3
          class="footer-cta-el text-[10vw] md:text-[8vw] leading-[0.85] font-black uppercase tracking-tighter text-transparent border-white/20 [-webkit-text-stroke:1px_rgba(255,255,255,0.2)] group-hover:[-webkit-text-stroke:1px_rgba(var(--primary),0.8)] group-hover:text-white transition-all duration-700 drop-shadow-[0_0_80px_rgba(var(--primary),0)] group-hover:drop-shadow-[0_0_80px_rgba(var(--primary),0.15)]"
        >
          Let's work<br />
          <span class="ml-[5vw] group-hover:ml-[7vw] transition-all duration-500">together</span>
        </h3>

        <div
          class="absolute top-1/2 right-[5%] -translate-y-1/2 hidden md:flex w-20 h-20 bg-primary text-black rounded-full items-center justify-center group-hover:scale-110 group-hover:rotate-45 transition-all duration-500 shadow-[0_0_30px_rgba(var(--primary),0.2)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
        </div>
      </a>
    </div>
  </div>

  <!-- Grid Layout -->
  <div class="footer-grid border-t border-white/5 relative z-10">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/5">

        <!-- Col 1: Brand & Time -->
        <div class="footer-col md:col-span-4 py-12 md:pr-8 flex flex-col justify-between min-h-[280px]">
          <div>
            <h3 class="font-bold text-2xl uppercase tracking-tight mb-2 text-white">{siteTitle}</h3>
            <p class="text-white/80 text-sm max-w-xs leading-relaxed">
              Full Stack Developer crafting digital experiences with precision and passion.
            </p>
          </div>

          <div class="flex flex-col gap-4 mt-8">
            <div class="font-mono text-xs">
              <p class="text-primary font-bold mb-1 tracking-[0.15em] uppercase">Local Time (You)</p>
              <p class="text-xl text-white tabular-nums">{localTime}</p>
            </div>
            <div class="font-mono text-xs">
              <p class="text-white/90 mb-1 tracking-[0.15em] uppercase">Budapest, HU (Me)</p>
              <p class="text-xl text-white/90 tabular-nums">{budapestTime}</p>
            </div>
          </div>
        </div>

        <!-- Col 2: Navigation -->
        <div class="footer-col footer-nav md:col-span-4 py-12 md:px-8 flex flex-col justify-between min-h-[280px]">
          <nav class="flex flex-col gap-2" aria-label="Footer Navigation">
            <p class="font-mono text-[10px] text-white/80 mb-4 tracking-[0.2em] uppercase">Menu</p>
            <a href="/" class="footer-nav-link group text-2xl font-bold text-white hover:text-primary hover:pl-4 transition-all duration-300 uppercase tracking-tight relative interactive">
              <span class="relative z-10">Home</span>
            </a>
            {#each navItems as item (item.route)}
              <a
                href={item.route}
                class="footer-nav-link group text-2xl font-bold text-white hover:text-primary hover:pl-4 transition-all duration-300 uppercase tracking-tight relative interactive"
              >
                <span class="relative z-10">{item.title}</span>
              </a>
            {/each}
          </nav>
        </div>

        <!-- Col 3: Socials -->
        <div class="footer-col md:col-span-4 py-12 md:pl-8 flex flex-col justify-between min-h-[280px]">
          <div class="social-links flex flex-col gap-4">
            <p class="font-mono text-[10px] text-white/80 mb-2 tracking-[0.2em] uppercase">Socials</p>
            <nav aria-label="Social Media Links">
              {#each socialLinks as social (social.label)}
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-link group flex items-center justify-between border-b border-white/5 pb-3 mb-1 hover:border-primary/30 transition-all duration-300 interactive overflow-hidden"
                >
                  <span class="text-base font-medium text-white/90 group-hover:text-primary transition-colors font-mono uppercase tracking-wide">{social.display}</span>
                  <div class="relative w-4 h-4 overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-white/80 group-hover:text-primary transition-all duration-300 group-hover:-translate-y-full group-hover:translate-x-full"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute top-full -left-full w-4 h-4 text-primary transition-all duration-300 group-hover:translate-y-[-100%] group-hover:translate-x-full"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  </div>
                </a>
              {/each}
            </nav>
          </div>

          <div class="flex justify-end pt-8">
            <button onclick={scrollToTop}
              aria-label="Back to top"
              class="group flex items-center gap-2 text-xs font-mono text-white/90 hover:text-white transition-colors interactive uppercase tracking-[0.15em]"
            >
              Back to top
              <div
                class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 group-hover:scale-110"
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
  <div class="border-t border-white/5 relative z-10">
    <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-white/90 uppercase tracking-[0.2em]">
      <p>&copy; {currentYear} {siteTitle}. All rights reserved.</p>
      <p>Designed & Developed in Budapest, HU</p>
    </div>
  </div>
</footer>

<style>
  :global(.text-stroke-white) {
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
  }
</style>
