<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { afterNavigate } from '$app/navigation';
  import { fade, scale } from 'svelte/transition';
  import { siteTitle, navItems } from '$lib/config.js';
  import { appState } from '$lib/state.svelte.js';
  import { magnetic } from '$lib/actions/magnetic.js';
  import gsap from 'gsap';

  // State
  let scrollY = $state(0);
  let windowWidth = $state(0);
  let navVisible = $state(false);
  let theme = $state('dark');

  // Computed
  let isMobile = $derived(windowWidth < 768);
  let isScrolled = $derived(scrollY > 100);

  const closeMenu = () => {
    appState.isMenuOpen = false;
  };

  const toggleTheme = () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    if (browser) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  };

  afterNavigate(() => {
    closeMenu();
  });

  onMount(() => {
    // Initial values
    scrollY = window.scrollY;
    windowWidth = window.innerWidth;

    if (browser) {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      theme = savedTheme;
      document.documentElement.setAttribute('data-theme', theme);
    }

    // Throttled scroll via rAF
    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          scrollY = window.scrollY;
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        windowWidth = window.innerWidth;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Entrance animation
    navVisible = true;
    gsap.fromTo(
      '.main-nav-container',
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.2 }
    );

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  });
</script>

<div class="relative z-100 w-full">
  <!-- 1. Top Header -->
  {#if navVisible}
    <header
      class="main-nav-container fixed top-2 sm:top-6 left-0 w-full z-101 transition-all duration-500 px-4 sm:px-6 flex justify-center pointer-events-none"
    >
      <div class="pointer-events-auto w-full max-w-[1000px] flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {isScrolled
        ? 'px-6 sm:px-8 py-3 rounded-full glass-panel border border-accent/20 shadow-[0_8px_32px_0_var(--glass-shadow)]'
        : 'px-5 sm:px-6 py-4 rounded-3xl bg-foreground/[0.03] backdrop-blur-xl border border-foreground/[0.08] shadow-[0_4px_24px_0_rgba(0,0,0,0.15)]'}">
        
        <!-- Morphing Logo Accordion -->
        <a href="/" class="group flex items-center gap-1 interactive shrink-0 select-none font-bold" aria-label="Norbert Br3tt - Home">
          <div class="logo-text text-xl font-black tracking-tight leading-none text-foreground flex items-center">
            <span class="text-foreground">N</span>
            <span class="logo-collapsible text-foreground" class:collapsed={isScrolled}>orbert</span>
            <span class="logo-space text-foreground" class:collapsed={isScrolled}></span>
            <span class="text-foreground/80">B</span>
            <span class="logo-collapsible text-foreground/80" class:collapsed={isScrolled}>r3tt</span>
            <span class="logo-dot text-accent" class:visible={isScrolled}>.</span>
          </div>
        </a>

        <div class="flex items-center gap-6">
          <!-- Desktop Nav Links -->
          <nav class="hidden md:flex items-center gap-6 lg:gap-8">
            {#each navItems as item, index (index)}
              <a
                href={item.route}
                use:magnetic={{ strength: 0.6, textStrength: 0.2 }}
                class="nav-link-magnetic relative flex items-center justify-center px-4 py-2.5 interactive group/navlink"
                aria-current={appState.currentPage === item.route ? 'page' : undefined}
              >
                <span
                  class="magnetic-text relative z-10 text-[13px] font-sans font-medium tracking-wide text-foreground/70 group-hover/navlink:text-foreground transition-colors duration-300 pointer-events-none whitespace-nowrap"
                >
                  {item.title}
                </span>
                <!-- Apple-style Active Indicator (Premium Gold) -->
                <span 
                  class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent transition-transform duration-300 ease-out {appState.currentPage === item.route ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover/navlink:scale-100 group-hover/navlink:opacity-50'}"
                ></span>
              </a>
            {/each}
          </nav>

          <!-- Action Utilities -->
          <div class="flex items-center gap-3">
            <!-- Theme Toggle Button -->
            <button
              onclick={toggleTheme}
              class="relative w-9 h-9 flex items-center justify-center rounded-full border border-foreground/[0.08] hover:border-accent/40 bg-foreground/[0.02] hover:bg-foreground/[0.05] active:scale-[0.97] transition-all duration-300 interactive group/theme-btn pointer-events-auto"
              aria-label="Toggle theme"
              use:magnetic={{ strength: 0.6, textStrength: 0.2 }}
            >
              {#if theme === 'dark'}
                <span in:scale={{ duration: 300, start: 0.6 }} class="text-accent flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-500 group-hover/theme-btn:rotate-12"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                </span>
              {:else}
                <span in:scale={{ duration: 300, start: 0.6 }} class="text-accent flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-500 group-hover/theme-btn:rotate-45"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                </span>
              {/if}
            </button>

            <!-- Menu Button — mobile only -->
            {#if isMobile}
              <div in:scale={{ duration: 300, start: 0.6 }} class="pointer-events-auto">
                <button
                  class="nav-link-magnetic shrink-0 bg-foreground/5 text-foreground border border-foreground/10 rounded-full flex flex-col items-center justify-center gap-[4px] active:scale-[0.97] transition-all duration-300 interactive w-9 h-9 hover:bg-foreground/10"
                  use:magnetic={{ strength: 0.6, textStrength: 0.2 }}
                  onclick={() => (appState.isMenuOpen = true)}
                  aria-label="Open menu"
                >
                  <div
                    class="magnetic-text w-full h-full flex flex-col items-center justify-center gap-[4px] pointer-events-none"
                  >
                    <span class="w-4 h-[2px] bg-current rounded-full"></span>
                    <span class="w-4 h-[2px] bg-current rounded-full"></span>
                  </div>
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </header>
  {/if}

  <!-- 2. Close Button -->
  {#if appState.isMenuOpen}
    <button
      in:fade={{ duration: 300 }}
      out:fade={{ duration: 300 }}
      class="fixed top-6 right-6 sm:right-12 w-12 h-12 bg-foreground/10 backdrop-blur-xl border border-foreground/20 text-foreground rounded-full flex items-center justify-center z-120 shadow-2xl interactive hover:bg-foreground hover:text-background active:scale-[0.97] transition-all duration-500"
      onclick={() => (appState.isMenuOpen = false)}
      aria-label="Close menu"
    >
      <div class="relative w-5 h-5 flex items-center justify-center">
        <span class="absolute w-5 h-[2px] bg-current rotate-45 rounded-full"></span>
        <span class="absolute w-5 h-[2px] bg-current -rotate-45 rounded-full"></span>
      </div>
    </button>
  {/if}

  <!-- 3. Backdrop -->
  {#if appState.isMenuOpen}
    <div
      in:fade={{ duration: 300 }}
      out:fade={{ duration: 300 }}
      class="fixed inset-0 bg-background/80 backdrop-blur-md z-105"
      onclick={() => (appState.isMenuOpen = false)}
      aria-hidden="true"
    ></div>
  {/if}

  <!-- 4. Side Menu Drawer -->
  <div
    class="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-background text-foreground z-108 flex flex-col pt-32 pb-16 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] shadow-2xl overflow-hidden {appState.isMenuOpen
      ? 'translate-x-0'
      : 'translate-x-full'}"
  >
    <nav class="flex flex-col items-start px-12 sm:px-16 gap-4 flex-1 overflow-y-auto mt-10" data-lenis-prevent>
      {#each navItems as item, index (index)}
        <a
          href={item.route}
          class="nav-link group flex items-baseline gap-5 text-4xl sm:text-5xl font-serif hover:text-foreground/70 transition-all duration-500 ease-out interactive {appState.isMenuOpen ? 'animate-slide-in' : ''}"
          style="animation-delay: {0.05 + index * 0.05}s"
          onclick={closeMenu}
          aria-current={appState.currentPage === item.route ? 'page' : undefined}
        >
          <span class="text-sm font-sans tracking-wide text-foreground/50 font-medium group-hover:text-foreground/30"
            >0{index + 1}</span
          >
          <span class="link-text">{item.title}</span>
        </a>
      {/each}
    </nav>

    <!-- Bottom Info -->
    <div class="px-12 sm:px-16 mt-8 space-y-10">
      <div class="flex flex-col gap-4">
        <p class="text-foreground/50 text-xs tracking-widest font-sans font-medium">SAY HELLO</p>
        <a
          href="mailto:norbertbrett@outlook.com"
          class="text-lg font-sans text-foreground hover:text-foreground/70 transition-colors interactive tracking-tight"
          >norbertbrett@outlook.com</a
        >
      </div>
    </div>
  </div>
</div>

<style>
  .nav-link {
    opacity: 0;
    transform: translateY(40px) skewY(5deg);
  }

  .animate-slide-in {
    animation: slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes slide-in {
    to {
      opacity: 1;
      transform: translateY(0) skewY(0);
    }
  }

  .link-text {
    display: inline-block;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .nav-link:hover .link-text {
    transform: translateX(10px);
  }

  /* ── Apple-Style Hover Capsule Highlight ── */
  .nav-link-magnetic::before {
    content: '';
    position: absolute;
    inset: 4px 0;
    background: var(--color-foreground);
    opacity: 0;
    transform: scale(0.94);
    border-radius: 9999px;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                background-color 0.4s ease;
    z-index: 0;
  }
  :global(html[data-theme="dark"]) .nav-link-magnetic::before {
    background: rgba(255, 255, 255, 0.04);
  }
  :global(html[data-theme="light"]) .nav-link-magnetic::before {
    background: rgba(0, 0, 0, 0.03);
  }
  .nav-link-magnetic:hover::before {
    opacity: 1;
    transform: scale(1);
  }

  /* ── Smooth Morphing Logo Accordion ── */
  .logo-collapsible {
    display: inline-block;
    max-width: 150px;
    opacity: 1;
    transform: scaleX(1);
    transform-origin: left center;
    transition: max-width 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
    vertical-align: bottom;
    white-space: nowrap;
  }

  .logo-collapsible.collapsed {
    max-width: 0px;
    opacity: 0;
    transform: scaleX(0);
  }

  .logo-space {
    display: inline-block;
    width: 0.25em;
    transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .logo-space.collapsed {
    width: 0px;
  }

  .logo-dot {
    display: inline-block;
    transform: scale(0);
    opacity: 0;
    font-size: 1.5rem;
    line-height: 0.5;
    transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
                opacity 0.8s ease;
  }

  .logo-dot.visible {
    transform: scale(1);
    opacity: 1;
  }
</style>