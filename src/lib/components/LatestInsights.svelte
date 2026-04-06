<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { ArrowRight } from '@lucide/svelte';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let { posts = [] } = $props();

  let sectionRef = $state(null);
  let activeIndex = $state(0);
  let ctx;

  onMount(() => {
    if (!browser || !sectionRef) return;

    ctx = gsap.context(() => {
      // Section label
      gsap.fromTo('.blog-label', 
        { y: 15, opacity: 0 }, 
        {
          y: 0, opacity: 1, duration: 0.4, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef, start: 'top 72%' }
        }
      );

      // Title
      gsap.fromTo('.blog-title', 
        { y: 60, opacity: 0 }, 
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef, start: 'top 70%' }
        }
      );

      // Button reveal
      gsap.fromTo('.blog-action', 
        { scale: 0.8, opacity: 0 }, 
        {
          scale: 1, opacity: 1, duration: 0.4, delay: 0.2, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: sectionRef, start: 'top 68%' }
        }
      );
    }, sectionRef);

    return () => {
      if (ctx) ctx.revert();
    };
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
</script>

<section bind:this={sectionRef} class="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden bg-background">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20">
      <div>
        <span class="blog-label text-xs font-mono tracking-[0.4em] uppercase text-primary font-medium mb-4 flex items-center gap-3">
          <span class="w-8 h-px bg-primary/60"></span> Writing
        </span>
        <h2 class="blog-title text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-tighter leading-[0.9] text-white uppercase relative">
          <span class="absolute -left-4 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary via-primary/40 to-transparent rounded-full"></span>
          Latest Insights
        </h2>
      </div>

      <a
        href="/articles"
        class="blog-action shrink-0 flex items-center justify-center w-20 h-20 rounded-full border border-white/20 text-xs font-mono uppercase tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all duration-300"
      >
        All
      </a>
    </div>
    
    <div 
      class="w-full h-[600px] md:h-[700px] flex flex-col md:flex-row gap-3 md:gap-4 group/accordion" 
      onmouseleave={() => activeIndex = 0}
      role="presentation"
    >
      {#each posts.slice(0, 4) as post, index}
        <a
          href="/articles/{post.slug}/"
          class="relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex border border-white/5 bg-white/[0.02]
            {activeIndex === index ? 'flex-[1_1_75%] md:flex-[1_1_70%]' : 'flex-[1_1_10%] md:flex-[1_1_10%]'}"
          onmouseenter={() => activeIndex = index}
        >
          <!-- Background Image & Overlays -->
          <div class="absolute inset-0 w-full h-full bg-[#0A0D0B]">
            {#if post.coverImage}
              <img
                src={post.coverImage}
                alt={post.title}
                class="w-full h-[150%] md:w-[150%] md:h-full object-cover transition-all duration-[1.5s] ease-out object-center
                  {activeIndex === index ? 'scale-100 opacity-100 blur-[0px]' : 'scale-102 opacity-40 blur-[2px] grayscale-[0.8]'}"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-700 {activeIndex === index ? 'opacity-100' : 'opacity-80 md:opacity-40'}"></div>
            {:else}
              <div class="w-full h-full bg-primary/5 backdrop-blur-3xl"></div>
            {/if}
          </div>

          <!-- Active Content Card -->
          <div 
             class="absolute inset-0 p-6 md:p-12 flex flex-col justify-end transition-all duration-500 delay-100
               {activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 md:translate-y-0 pointer-events-none'}"
          >
            <!-- Story Header -->
            <div class="flex flex-wrap items-center gap-4 mb-4">
              <span class="px-3 py-1.5 bg-white/10 backdrop-blur-md text-[10px] font-mono tracking-widest text-white uppercase rounded-full border border-white/10">
                Article 0{ index + 1 }
              </span>
              <span class="text-[10px] font-mono tracking-[0.25em] uppercase text-primary font-bold">
                { formatDate(post.date) }
              </span>
            </div>

            <!-- Focus Title -->
            <h3 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-[-.02em] text-white leading-[1.05] mb-4 lg:whitespace-nowrap truncate max-w-full drop-shadow-2xl">
              { post.title }
            </h3>
            
            <!-- Details Container -->
            <div class="overflow-hidden transition-all duration-700 {activeIndex === index ? 'max-h-[300px]' : 'max-h-0'}">
              <p class="text-sm md:text-base text-white/80 font-sans font-light leading-relaxed max-w-xl mb-8 line-clamp-2 md:line-clamp-3">
                { post.excerpt || post.description }
              </p>
              <div class="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-primary text-black text-xs font-mono font-bold tracking-[0.1em] uppercase hover:bg-white transition-all transform hover:scale-105">
                Read Article
                <ArrowRight class="w-4 h-4" />
              </div>
            </div>
          </div>

          <!-- Vertical Label (Visible when collapsed) -->
          <div 
            class="absolute inset-0 hidden md:flex items-center justify-center p-4 transition-opacity duration-500
              {activeIndex === index ? 'opacity-0 pointer-events-none' : 'opacity-100'}"
          >
            <h3 class="text-xl font-serif font-bold text-white/70 -rotate-90 origin-center whitespace-nowrap tracking-wider drop-shadow-md">
              { post.title.length > 25 ? post.title.slice(0, 25) + '...' : post.title }
            </h3>
            <span class="absolute bottom-8 text-[10px] font-mono tracking-widest text-primary font-bold">
              0{ index + 1 }
            </span>
          </div>
        </a>
      {/each}
    </div>

    <!-- Mobile Navigation -->
    <div class="mt-16 md:hidden">
      <a
        href="/articles"
        class="flex items-center justify-center gap-3 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] text-white font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
      >
        View All <span class="text-primary">Articles</span>
      </a>
    </div>
  </div>
</section>

<style>
  /* Base styles for the accordion container */
</style>
