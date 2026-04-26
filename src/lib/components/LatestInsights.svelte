<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { splitReveal } from '$lib/actions/splitReveal.js';
  import { magnetic } from '$lib/actions/magnetic.js';
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
      // Section label clip-reveal
      gsap.fromTo('.blog-label', 
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 }, 
        {
          clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef, start: 'top 72%' }
        }
      );

      // Button reveal with spring
      gsap.fromTo('.blog-action', 
        { scale: 0.8, opacity: 0 }, 
        {
          scale: 1, opacity: 1, duration: 0.4, delay: 0.2, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: sectionRef, start: 'top 68%' }
        }
      );

      // Deep Parallax on images
      const images = gsap.utils.toArray('.parallax-img');
      images.forEach((img) => {
        gsap.to(img, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      // Accordion cards stagger entrance
      gsap.fromTo('.accordion-card',
        { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 1, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef, start: 'top 65%' }
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
        <h2 use:splitReveal={{ type: 'chars', delay: 0.2 }} class="blog-title text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-tighter leading-[0.9] text-white uppercase relative">
          Latest Insights
        </h2>
      </div>

      <!-- Magnetic hover on "All" button -->
      <a
        href="/articles"
        use:magnetic={{ strength: 0.5, textStrength: 0.2 }}
        class="blog-action shrink-0 flex items-center justify-center w-20 h-20 rounded-full border border-white/20 text-xs font-mono uppercase tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all duration-300 interactive"
      >
        <span class="magnetic-text">All</span>
      </a>
    </div>
    
    <!-- Hick's Law: Limited to 4 articles maximum; "View All" is progressive disclosure -->
    <div 
      class="w-full h-[600px] md:h-[700px] flex flex-col md:flex-row gap-3 md:gap-4 group/accordion" 
      onmouseleave={() => activeIndex = 0}
      role="presentation"
    >
      {#each posts.slice(0, 4) as post, index}
        <a
          href="/articles/{post.slug}/"
          class="accordion-card relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex border bg-white/2 group/card
            {activeIndex === index ? 'flex-[1_1_75%] md:flex-[1_1_70%] border-primary/40 shadow-[0_0_50px_rgba(201,168,76,0.15)]' : 'flex-[1_1_10%] md:flex-[1_1_10%] border-white/5 hover:border-white/20'}"
          onmouseenter={() => activeIndex = index}
        >
          <!-- Background Image & Overlays -->
          <div class="absolute inset-0 w-full h-full bg-[#0A0D0B]">
            {#if post.coverImage}
              <img
                src={post.coverImage}
                alt={post.title}
                class="parallax-img w-full h-[130%] md:h-[130%] object-cover transition-all duration-[1.5s] ease-out object-center origin-center
                  {activeIndex === index ? 'scale-100 opacity-100 blur-[0px] animate-ken-burns' : 'scale-105 opacity-40 blur-[2px] grayscale-[0.8]'}"
              />
              <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-700 {activeIndex === index ? 'opacity-100' : 'opacity-80 md:opacity-40'}"></div>
            {:else}
              <div class="w-full h-full bg-primary/5 backdrop-blur-3xl"></div>
            {/if}
          </div>

          <!-- Von Restorff: First (default active) article has primary border glow -->
          {#if index === 0 && activeIndex === 0}
            <div class="absolute inset-0 rounded-3xl shadow-[inset_0_0_30px_rgba(201,168,76,0.05)] pointer-events-none z-10"></div>
          {/if}

          <!-- Active Content Card -->
          <div 
             class="absolute inset-0 p-6 md:p-12 flex flex-col justify-end transition-all duration-500 delay-100
               {activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 md:translate-y-0 pointer-events-none'}"
          >
            <!-- Story Header (Proximity Law: date + category grouped tightly, separated from title) -->
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
            
            <!-- Miller's Law: Chunking Information into digestible blocks -->
            <div class="flex flex-col gap-6 overflow-hidden transition-all duration-700 {activeIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}">
              <div class="space-y-4">
                <p class="text-sm md:text-base text-white/80 font-sans font-light leading-relaxed max-w-xl line-clamp-2 md:line-clamp-3">
                  { post.excerpt || post.description }
                </p>
                
                <div class="flex items-center gap-6">
                  <div class="h-px w-12 bg-white/10"></div>
                  <span class="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase italic">Est. 5 min read</span>
                </div>
              </div>

              <div class="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-primary text-black text-xs font-mono font-bold tracking-widest uppercase hover:bg-white transition-all transform hover:scale-105 w-fit shadow-xl shadow-primary/10">
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
        class="flex items-center justify-center gap-3 h-14 w-full rounded-2xl border border-white/10 bg-white/3 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
      >
        View All <span class="text-primary">Articles</span>
      </a>
    </div>
  </div>
</section>

<style>
  .accordion-card {
    will-change: transform, opacity, clip-path;
  }
</style>
