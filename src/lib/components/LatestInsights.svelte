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
  let isMobile = $state(false);
  let activeIndex = $state(0);
  let ctx;

  onMount(() => {
    if (!browser || !sectionRef) return;

    isMobile = window.innerWidth < 768 || matchMedia('(pointer: coarse)').matches;
    const isMobileDevice = isMobile;

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

      if (isMobileDevice) {
        // MOBILE HIGH-PERFORMANCE EXPERIENCE
        gsap.fromTo('.accordion-card',
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef, start: 'top 75%' }
          }
        );
      } else {
        // DESKTOP ADVANCED CINEMATIC EXPERIENCE
        // Deep Parallax on image wrappers
        const wraps = gsap.utils.toArray('.parallax-wrap');
        wraps.forEach((wrap) => {
          gsap.fromTo(wrap,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        });

        // The Cascade: 3D unfold sequence
        gsap.set('.accordion-card', { transformPerspective: 1500, transformOrigin: 'top center' });
        gsap.fromTo('.accordion-card',
          { rotateX: -90, opacity: 0, y: -50 },
          {
            rotateX: 0, opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'back.out(1.4)',
            scrollTrigger: { trigger: sectionRef, start: 'top 70%', once: true }
          }
        );
      }
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
        <span class="blog-label text-xs font-sans tracking-widest uppercase text-primary font-medium mb-4 flex items-center gap-3">
          <span class="w-8 h-px bg-primary/60"></span> Writing
        </span>
        <h2 use:splitReveal={{ type: 'chars', delay: 0.2 }} class="blog-title text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight leading-[0.9] text-foreground">
          Latest Insights
        </h2>
      </div>

      <a
        href="/articles"
        use:magnetic={{ strength: 0.5, textStrength: 0.2 }}
        class="blog-action shrink-0 flex items-center justify-center w-20 h-20 rounded-full border border-primary text-primary text-xs font-sans font-bold tracking-widest uppercase hover:bg-primary hover:text-[#0d0c0c] hover:border-primary hover:shadow-[0_0_20px_rgba(212,176,85,0.4)] active:scale-[0.97] transition-all duration-300 interactive"
      >
        <span class="magnetic-text font-bold">All</span>
      </a>
    </div>
    
    {#if isMobile}
      <!-- Mobile Native Scroll-Snap Horizontal Carousel -->
      <div class="w-full overflow-x-auto flex gap-4 snap-x snap-mandatory scrollbar-hide py-4 px-1 select-none">
        {#each posts.slice(0, 4) as post, index}
          <a
            href="/articles/{post.slug}/"
            class="snap-start shrink-0 w-[85vw] sm:w-[60vw] rounded-3xl overflow-hidden glass-panel flex flex-col h-[400px] relative group"
          >
            <!-- Cover Image / Aspect Wrapper -->
            <div class="h-44 w-full overflow-hidden relative">
              {#if post.coverImage}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="lazy"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent"></div>
              {:else}
                <div class="w-full h-full bg-primary/5 flex items-center justify-center border-b border-foreground/10">
                  <span class="text-[9px] text-foreground/30 font-mono tracking-widest uppercase">IMAGE HOLDER</span>
                </div>
              {/if}
              <span class="absolute top-4 left-4 px-3 py-1.5 bg-background/40 backdrop-blur-md text-[9px] font-sans font-semibold tracking-widest text-foreground uppercase rounded-full border border-foreground/10">
                Article 0{ index + 1 }
              </span>
            </div>

            <!-- Content Area -->
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div class="space-y-2">
                <span class="text-[9px] font-sans font-bold tracking-widest uppercase text-primary">
                  { formatDate(post.date) }
                </span>
                <h3 class="text-xl font-serif tracking-tight text-foreground line-clamp-2 leading-tight">
                  { post.title }
                </h3>
                <p class="text-xs text-foreground/70 font-sans font-light leading-relaxed line-clamp-2">
                  { post.excerpt || post.description }
                </p>
              </div>

              <!-- Foot Details -->
              <div class="flex items-center justify-between mt-4 pt-4 border-t border-foreground/10">
                <span class="text-[9px] font-sans font-medium tracking-widest text-foreground/50 uppercase font-mono">5 Min Read</span>
                <span class="inline-flex items-center gap-1.5 text-[9px] font-sans font-bold tracking-widest uppercase text-primary font-mono">
                  Read Article <ArrowRight class="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <!-- Desktop Accordion Layout -->
      <div 
        class="w-full h-[600px] md:h-[700px] flex flex-col md:flex-row gap-3 md:gap-4 group/accordion" 
        onmouseleave={() => activeIndex = 0}
        role="presentation"
      >
        {#each posts.slice(0, 4) as post, index}
          <a
            href="/articles/{post.slug}/"
            class="accordion-card relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex border bg-white/2 group/card
              {activeIndex === index 
                ? 'flex-[1_1_75%] md:flex-[1_1_70%] border-primary/45 shadow-[0_0_50px_rgba(212,176,85,0.12)]' 
                : 'flex-[1_1_10%] md:flex-[1_1_10%] border-white/5 hover:border-white/20'}"
            onmouseenter={() => activeIndex = index}
          >
            <!-- Background Image & Overlays -->
            <div class="absolute inset-0 w-full h-full bg-[#0A0D0B] overflow-hidden">
              {#if post.coverImage}
                <!-- Parallax Wrapper (translated by GSAP) -->
                <div class="parallax-wrap absolute inset-0 w-full h-[120%] -top-[10%]">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    class="w-full h-full object-cover transition-[opacity,filter] duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] object-center
                      {activeIndex === index ? 'opacity-100 blur-[0px]' : 'opacity-40 blur-[2.5px] grayscale-[0.8]'}"
                  />
                </div>
                <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/10 transition-opacity duration-700 {activeIndex === index ? 'opacity-100' : 'opacity-80 md:opacity-40'}"></div>
              {:else}
                <div class="w-full h-full bg-primary/5 backdrop-blur-3xl"></div>
              {/if}
            </div>

            <!-- Inset glow overlay on default active element -->
            {#if index === 0 && activeIndex === 0}
              <div class="absolute inset-0 rounded-3xl shadow-[inset_0_0_30px_rgba(212,176,85,0.05)] pointer-events-none z-10"></div>
            {/if}

            <!-- Active Content Card (Floating Frosted Glass Panel for High-Contrast Accessibility) -->
            <div 
               class="absolute bottom-6 left-6 right-6 p-6 md:p-8 flex flex-col justify-end transition-all duration-500 delay-100
                 rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl shadow-2xl z-20
                 {activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 md:translate-y-0 pointer-events-none'}"
            >
              <!-- Story Header -->
              <div class="flex flex-wrap items-center gap-4 mb-4">
                <span class="px-3 py-1.5 bg-white/10 backdrop-blur-md text-[10px] font-sans font-semibold tracking-widest text-white uppercase rounded-full border border-white/10">
                  Article 0{ index + 1 }
                </span>
                {#if post.categories && post.categories.length > 0}
                  <span class="text-[10px] font-sans font-bold tracking-widest uppercase text-primary">
                    // { post.categories[0] }
                  </span>
                {/if}
                <span class="text-[10px] font-mono text-white/50 tracking-wider">
                  { formatDate(post.date) }
                </span>
              </div>

              <!-- Focus Title -->
              <h3 class="text-2xl sm:text-3xl lg:text-4xl font-serif tracking-tight text-white leading-[1.15] mb-4 truncate max-w-full drop-shadow-2xl">
                { post.title }
              </h3>
              
              <!-- Content Description Block -->
              <div class="flex flex-col gap-6 overflow-hidden transition-all duration-700 {activeIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}">
                <div class="space-y-4">
                  <p class="text-sm text-white/80 font-sans font-light leading-relaxed max-w-xl line-clamp-2 md:line-clamp-3">
                    { post.excerpt || post.description }
                  </p>
                  
                  <div class="flex items-center gap-6">
                    <div class="h-px w-12 bg-white/10"></div>
                    <span class="text-[10px] font-sans font-medium tracking-widest text-white/40 uppercase font-mono">5 min read</span>
                  </div>
                </div>

                <div class="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-primary text-primary text-xs font-sans font-bold tracking-widest uppercase hover:bg-primary hover:text-[#0d0c0c] hover:shadow-[0_0_20px_rgba(212,176,85,0.4)] transition-all transform hover:scale-105 w-fit shadow-xl">
                  Read Article
                  <ArrowRight class="w-4 h-4" />
                </div>
              </div>
            </div>

            <!-- Vertical Label (Visible when collapsed) -->
            <div 
              class="absolute inset-0 hidden md:flex flex-col items-center justify-between py-12 px-4 transition-opacity duration-500
                {activeIndex === index ? 'opacity-0 pointer-events-none' : 'opacity-100'}"
            >
              <!-- Index number at top -->
              <span class="text-2xl font-serif font-black text-foreground/20 tracking-tight select-none">
                0{ index + 1 }
              </span>
              
              <!-- Clean vertical text alignment using CSS writing-mode -->
              <h3 class="vertical-text text-sm font-sans font-bold text-foreground/60 tracking-widest uppercase whitespace-nowrap select-none">
                { post.title.length > 25 ? post.title.slice(0, 25) + '...' : post.title }
              </h3>

              <!-- Category Code at bottom -->
              {#if post.categories && post.categories.length > 0}
                <span class="text-[8px] font-mono font-bold tracking-widest text-primary/75 uppercase select-none">
                  // { post.categories[0] }
                </span>
              {:else}
                <span class="text-[8px] font-mono font-bold tracking-widest text-primary/75 uppercase select-none">
                  // ARTICLE
                </span>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    {/if}

    <!-- Mobile Navigation -->
    <div class="mt-16 md:hidden">
      <a
        href="/articles"
        class="flex items-center justify-center gap-3 h-14 w-full rounded-2xl border border-foreground/10 bg-foreground/5 text-foreground font-sans font-medium text-xs tracking-widest uppercase hover:bg-foreground/10 active:scale-[0.97] transition-all font-mono"
      >
        View All <span class="text-primary font-bold">Articles</span>
      </a>
    </div>
  </div>
</section>

<style>
  /* Clean vertical writing mode layout for sidebar labels */
  .vertical-text {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }
</style>
