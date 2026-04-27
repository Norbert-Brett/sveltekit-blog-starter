<script>
  import { onMount, tick } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { Search, Plus, X } from '@lucide/svelte';
  import PostsList from '$lib/components/PostsList.svelte';
  import { siteDescription } from '$lib/config';

  let { data } = $props();

  let visibleCount = $state(6);
  let isLoading = $state(false);
  let searchQuery = $state('');
  
  // Strictly enforce array typing to prevent slice errors during upstream API failures
  let safePosts = $derived(Array.isArray(data?.posts) ? data.posts : []);
  let safeTotal = $derived(typeof data?.total === 'number' ? data.total : 0);
  
  let filteredPosts = $derived(
    searchQuery.trim() === '' 
      ? safePosts 
      : safePosts.filter(post => 
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.categories?.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
        )
  );

  let visiblePosts = $derived(filteredPosts.slice(0, visibleCount));
  let hasMore = $derived(visibleCount < filteredPosts.length);

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

  const clearSearch = () => {
    searchQuery = '';
    visibleCount = 6;
  };

  onMount(() => {
    const tl = gsap.timeline();
    tl.fromTo('.page-header-title', 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    ).fromTo(['.page-header-desc', '.search-bar-container'],
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 },
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
      <span class="inline-block text-xs font-sans font-semibold tracking-widest uppercase text-primary mb-6">--- WRITINGS & INSIGHTS</span>
      <h1 class="page-header-title text-6xl md:text-8xl lg:text-9xl font-sans font-bold tracking-tight text-white leading-[0.85] mb-8">
        Articles<span class="text-primary">.</span>
      </h1>
      <p class="page-header-desc text-lg md:text-xl text-white/70 font-sans font-light max-w-2xl leading-relaxed">
        Deep dives into software architecture, the evolution of AI-driven interfaces, and the philosophy of building resilient, beautiful digital products.
      </p>
    </div>

    <!-- Search Interface -->
    <div class="search-bar-container mb-16 md:mb-24 opacity-0 flex flex-col md:flex-row md:items-center justify-between gap-8">
      <div class="relative group w-full max-w-xl">
        <input 
          type="text"
          bind:value={searchQuery}
          placeholder="Keyword search (e.g. Svelte, AI, Design)..."
          class="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-12 text-white font-sans font-medium tracking-wide focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-500 backdrop-blur-3xl placeholder:text-white/40 shadow-2xl relative z-10"
        />
        <div class="absolute inset-y-0 left-6 flex items-center pointer-events-none z-20">
          <Search class="w-5 h-5 text-primary opacity-70 group-focus-within:opacity-100 transition-opacity" />
        </div>
        {#if searchQuery}
          <button 
            onclick={clearSearch}
            class="absolute inset-y-0 right-4 flex items-center px-2 text-white/50 hover:text-primary transition-colors z-20"
            aria-label="Clear search"
          >
            <X class="w-5 h-5" />
          </button>
        {/if}
        <div class="absolute bottom-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 z-20"></div>
      </div>

      <div class="flex items-center gap-4 text-xs font-sans font-semibold tracking-widest text-white/60 uppercase">
        <span class="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"></span>
        <span>{filteredPosts.length} matches discovered</span>
      </div>
    </div>

    <div class="relative">
      <div class="absolute -left-12 top-0 bottom-0 w-px bg-linear-to-b from-primary/20 via-transparent to-transparent hidden lg:block"></div>
      
      {#if filteredPosts.length > 0}
        <PostsList posts={visiblePosts} />
      {:else}
        <div class="py-24 text-center border border-white/5 rounded-3xl bg-white/1 backdrop-blur-md">
          <h3 class="text-2xl md:text-3xl font-sans font-semibold text-white/70 mb-4 tracking-tight">No articles discovered matching <br class="md:hidden"/> "<span class="text-white/90">{searchQuery}</span>"</h3>
          <p class="text-white/50 mb-12 max-w-md mx-auto font-sans font-light px-6 text-sm md:text-base leading-relaxed">We couldn't find any documents matching your criteria. Try adjusting your research parameters or clearing the filter.</p>
          <button 
            onclick={clearSearch}
            class="group flex items-center gap-3 mx-auto px-8 py-3 rounded-full border border-primary/20 hover:bg-primary/10 transition-all duration-500"
          >
             <span class="text-xs font-sans font-semibold tracking-widest text-primary uppercase">Reset Search</span>
             <X class="w-3 h-3 text-primary group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      {/if}
      
      {#if hasMore}
        <div class="mt-32 mb-16 flex justify-center">
          <button 
            onclick={loadMore}
            disabled={isLoading}
            class="group flex flex-col items-center gap-6 cursor-pointer disabled:cursor-wait"
          >
            <div class="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center bg-white/3 group-hover:bg-primary group-hover:border-primary transition-all duration-700 shadow-2xl relative overflow-hidden">
               {#if isLoading}
                 <div class="absolute inset-0 border-2 border-primary border-t-transparent animate-spin rounded-full opacity-40"></div>
                 <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
               {:else}
                 <Plus class="w-8 h-8 text-white group-hover:text-black transition-colors duration-500" />
               {/if}
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <span class="text-xs font-sans font-semibold tracking-widest text-white group-hover:text-primary transition-colors uppercase">
                {isLoading ? 'Discovering...' : 'Discover More'}
              </span>
              <span class="text-xs font-sans text-white/50 tracking-wide group-hover:text-primary/40">
                {isLoading ? 'Fetching articles...' : `Showing ${visibleCount} / ${filteredPosts.length}`}
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