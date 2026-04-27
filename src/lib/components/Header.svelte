<script>
  import { onMount } from 'svelte';
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

  // Computed
  let isMobile = $derived(windowWidth < 768);
  let isScrolled = $derived(scrollY > 100);

  const closeMenu = () => {
    appState.isMenuOpen = false;
  };

  afterNavigate(() => {
    closeMenu();
  });



  onMount(() => {
    // Initial values
    scrollY = window.scrollY;
    windowWidth = window.innerWidth;

    // Listeners
    const handleScroll = () => (scrollY = window.scrollY);
    const handleResize = () => (windowWidth = window.innerWidth);

    window.addEventListener('scroll', handleScroll);
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
    };
  });
</script>

<div class="relative z-100 w-full">
  <!-- 1. Top Header -->
  {#if navVisible}
    <header
      class="main-nav-container fixed top-2 sm:top-6 left-0 w-full z-101 transition-all duration-500 px-4 sm:px-6 flex justify-center pointer-events-none"
    >
      <div class="pointer-events-auto w-full max-w-[1000px] flex items-center justify-between transition-all duration-500 {isScrolled
        ? 'px-6 sm:px-8 py-3 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]'
        : 'px-2 sm:px-4 py-4 bg-transparent border border-transparent'}">
        <!-- Logo -->
        <a href="/" class="group flex items-center gap-1 interactive shrink-0">
          <div class="relative w-32 sm:w-48 h-8 sm:h-10 flex items-center">
            {#if !isScrolled}
              <span
                in:fade={{ duration: 400 }}
                out:fade={{ duration: 400 }}
                class="absolute left-0 text-xl font-bold tracking-tight leading-none text-white whitespace-nowrap"
              >
                {siteTitle.split(' ')[0]} <span class="text-white/60">{siteTitle.split(' ').slice(1).join(' ')}</span>
              </span>
            {:else}
              <span
                in:scale={{ duration: 600, start: 0.8, opacity: 0 }}
                out:fade={{ duration: 300 }}
                class="absolute left-0 text-xl font-bold tracking-tight leading-none text-white"
              >
                {siteTitle.split(' ').map(n => n[0]).join('')}<span class="text-white/60">.</span>
              </span>
            {/if}
          </div>
        </a>

        <div class="flex items-center gap-8">
          <!-- Desktop Nav Links -->
          <nav class="hidden md:flex items-center gap-8 lg:gap-10">
            {#each navItems as item, index (index)}
              <a
                href={item.route}
                use:magnetic={{ strength: 0.6, textStrength: 0.2 }}
                class="nav-link-magnetic relative flex items-center justify-center px-4 py-2 interactive group/navlink"
              >
                <span
                  class="magnetic-text text-[13px] font-sans font-medium tracking-wide text-white/70 group-hover/navlink:text-white transition-colors duration-300 pointer-events-none whitespace-nowrap"
                >
                  {item.title}
                </span>
                <!-- Apple-style Active Indicator -->
                <span 
                  class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white transition-transform duration-300 ease-out {appState.currentPage === item.route ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover/navlink:scale-100 group-hover/navlink:opacity-50'}"
                ></span>
              </a>
            {/each}
          </nav>

          <!-- Menu Button — mobile only -->
          {#if isMobile}
            <div in:scale={{ duration: 300, start: 0.6 }}>
              <button
                class="nav-link-magnetic shrink-0 bg-white/10 text-white border border-white/20 rounded-full flex flex-col items-center justify-center gap-[4px] transition-all duration-300 interactive w-10 h-10 hover:bg-white/20"
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
    </header>
  {/if}

  <!-- 2. Close Button -->
  {#if appState.isMenuOpen}
    <button
      in:fade={{ duration: 300 }}
      out:fade={{ duration: 300 }}
      class="fixed top-6 right-6 sm:right-12 w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full flex items-center justify-center z-120 shadow-2xl interactive hover:bg-white hover:text-black transition-all duration-500"
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
      class="fixed inset-0 bg-black/70 backdrop-blur-md z-105"
      onclick={() => (appState.isMenuOpen = false)}
      aria-hidden="true"
    ></div>
  {/if}

  <!-- 4. Side Menu Drawer -->
  <div
    class="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-background text-white z-108 flex flex-col pt-32 pb-16 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] shadow-2xl overflow-hidden {appState.isMenuOpen
      ? 'translate-x-0'
      : 'translate-x-full'}"
  >
    <nav class="flex flex-col items-start px-12 sm:px-16 gap-4 flex-1 overflow-y-auto mt-10">
      {#each navItems as item, index (index)}
        <a
          href={item.route}
          class="nav-link group flex items-baseline gap-5 text-4xl sm:text-5xl font-sans font-bold tracking-tight hover:text-white/70 transition-all duration-500 ease-out interactive {appState.isMenuOpen ? 'animate-slide-in' : ''}"
          style="animation-delay: {0.05 + index * 0.05}s"
          onclick={closeMenu}
        >
          <span class="text-sm font-sans tracking-wide text-white/50 font-medium group-hover:text-white/30"
            >0{index + 1}</span
          >
          <span class="link-text">{item.title}</span>
        </a>
      {/each}
    </nav>

    <!-- Bottom Info -->
    <div class="px-12 sm:px-16 mt-8 space-y-10">
      <div class="flex flex-col gap-4">
        <p class="text-white/50 text-xs tracking-widest font-sans font-medium">SAY HELLO</p>
        <a
          href="mailto:norbertbrett@outlook.com"
          class="text-lg font-sans text-white hover:text-white/70 transition-colors interactive tracking-tight"
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
</style>