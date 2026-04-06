<script>
  import { onMount, tick } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { Plus } from '@lucide/svelte';
  import PostsList from '$lib/components/PostsList.svelte';
  import { siteDescription } from '$lib/config';

  let { data } = $props();

  let visibleCount = $state(6);
  let isLoading = $state(false);
  
  // Strictly enforce array typing to prevent slice errors during upstream API failures
  let safePosts = $derived(Array.isArray(data?.posts) ? data.posts : []);
  let safeTotal = $derived(typeof data?.total === 'number' ? data.total : 0);
  
  let visiblePosts = $derived(safePosts.slice(0, visibleCount));
  let hasMore = $derived(visibleCount < safeTotal);

  const loadMore = async () => {
    if (isLoading) return;
    isLoading = true;
    
    // Simulate a brief "discovering" feel for premium UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    visibleCount += 6;
    await tick();
    ScrollTrigger.refresh();
    isLoading = false;
  };

  onMount(() => {
    const tl = gsap.timeline();
    tl.fromTo('.page-header-title', 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    ).fromTo('.page-header-desc',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    );
    
    // Ensure scroll trigger is healthy on mount
    setTimeout(() => ScrollTrigger.refresh(), 500);
  });
</script>

<svelte:head>
  <title>Articles Directory | Portfolio</title>
  <meta data-key="description" name="description" content={siteDescription}>
</svelte:head>

<section class="min-h-screen py-32 md:py-48 px-6 relative overflow-hidden bg-background">
  <!-- Atmospheric Background Elements -->
  <div class="absolute inset-0 z-0 pointer-events-none">
    <div class="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
    <div class="absolute bottom-[-5%] left-[-5%] w-[30vw] h-[30vw] bg-primary/3 rounded-full blur-[100px]"></div>
  </div>

  <div class="max-w-6xl mx-auto z-10 relative">
    <div class="mb-24 md:mb-32">
      <span class="inline-block text-[10px] font-mono tracking-[0.4em] uppercase text-primary mb-6">--- WRITINGS & INSIGHTS</span>
      <h1 class="page-header-title text-6xl md:text-8xl lg:text-9xl font-serif font-black tracking-[-0.04em] text-white leading-[0.85] mb-8">
        Articles<span class="text-primary italic">.</span>
      </h1>
      <p class="page-header-desc text-lg md:text-xl text-white/50 font-sans font-light max-w-2xl leading-relaxed">
        Deep dives into software architecture, the evolution of AI-driven interfaces, and the philosophy of building resilient, beautiful digital products.
      </p>
    </div>

    <div class="relative">
      <div class="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-transparent to-transparent hidden lg:block"></div>
      <PostsList posts={visiblePosts} />
      
      {#if hasMore}
        <div class="mt-32 mb-16 flex justify-center">
          <button 
            onclick={loadMore}
            disabled={isLoading}
            class="group flex flex-col items-center gap-6 cursor-pointer disabled:cursor-wait"
          >
            <div class="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.03] group-hover:bg-primary group-hover:border-primary transition-all duration-700 shadow-2xl relative overflow-hidden">
               {#if isLoading}
                 <div class="absolute inset-0 border-2 border-primary border-t-transparent animate-spin rounded-full opacity-40"></div>
                 <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
               {:else}
                 <Plus class="w-8 h-8 text-white group-hover:text-black transition-colors duration-500" />
               {/if}
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <span class="text-[11px] font-mono font-bold uppercase tracking-[0.4em] text-white group-hover:text-primary transition-colors">
                {isLoading ? 'Discovering...' : 'Discover More'}
              </span>
              <span class="text-[9px] font-mono text-white/20 tracking-[0.2em] uppercase group-hover:text-primary/40">
                {isLoading ? 'Fetching Article Library' : `Showing ${visibleCount} / ${data.total}`}
              </span>
            </div>
          </button>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 10s ease-in-out infinite;
  }
</style>