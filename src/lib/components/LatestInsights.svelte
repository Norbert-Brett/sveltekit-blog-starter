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
        // DESKTOP HORIZONTAL SCROLL EXPERIENCE
        // Deep Parallax on image wrappers
        const wraps = gsap.utils.toArray('.parallax-wrap');
        wraps.forEach((wrap) => {
          gsap.fromTo(wrap,
            { xPercent: -10 },
            {
              xPercent: 10,
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

        // Horizontal scroll sequence
        const container = sectionRef.querySelector('.horizontal-scroll-container');
        if (container) {
          gsap.to(container, {
            x: () => {
              const parent = container.parentElement;
              return -(container.scrollWidth - parent.offsetWidth);
            },
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef,
              start: 'top top',
              end: () => {
                const parent = container.parentElement;
                return `+=${container.scrollWidth - parent.offsetWidth}`;
              },
              pin: true,
              scrub: 1.2,
              invalidateOnRefresh: true,
            }
          });
          
          // Animate cards on enter
          gsap.fromTo('.horizontal-item',
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1, scale: 1, duration: 1.2, stagger: 0.15, ease: 'power4.out',
              scrollTrigger: { trigger: sectionRef, start: 'top 70%', once: true }
            }
          );
        }
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

<section bind:this={sectionRef} class="relative py-32 md:py-0 md:h-screen md:flex md:flex-col md:justify-center overflow-hidden bg-background">
  <!-- Header -->
  <div class="w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-24 mb-12 md:mb-16 shrink-0">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
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
  </div>
  
  {#if isMobile}
    <!-- Mobile Native Scroll-Snap Horizontal Carousel -->
    <div class="w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
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
    </div>
  {:else}
    <!-- Desktop Horizontal Scroll Layout -->
    <div class="hidden md:block w-full overflow-hidden relative" style="height: 60vh;">
      <div class="horizontal-scroll-container flex h-full items-center gap-8 md:gap-12 w-max px-6 md:px-12 lg:px-24 min-[1200px]:pl-[calc((100vw-72rem)/2+6rem)] min-[1200px]:pr-[calc((100vw-72rem)/2+6rem)]">
        {#each posts.slice(0, 4) as post, index}
          <a
            href="/articles/{post.slug}/"
            class="horizontal-item relative w-[60vw] max-w-[800px] h-[85%] rounded-[2.5rem] overflow-hidden glass-panel shrink-0 group/card border border-white/5 hover:border-primary/45 transition-colors duration-500 hover:shadow-[0_0_50px_rgba(212,176,85,0.12)] flex flex-col justify-end"
          >
            <!-- Background Image & Overlays -->
            <div class="absolute inset-0 w-full h-full bg-[#0A0D0B] overflow-hidden">
              {#if post.coverImage}
                <div class="absolute inset-0 w-full h-[120%] -top-[10%] parallax-wrap">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    class="w-full h-full object-cover transition-[transform,filter] duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-105 group-hover/card:blur-0 blur-[1px] grayscale-[0.4] group-hover/card:grayscale-0"
                  />
                </div>
                <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-700"></div>
              {:else}
                <div class="w-full h-full bg-primary/5 backdrop-blur-3xl"></div>
              {/if}
            </div>

            <!-- Content Panel -->
            <div class="relative p-8 md:p-12 z-20 flex flex-col justify-end pointer-events-none">
              <div class="flex items-center gap-4 mb-6">
                <span class="px-4 py-2 bg-white/10 backdrop-blur-md text-xs font-sans font-semibold tracking-widest text-white uppercase rounded-full border border-white/10">
                  Article 0{ index + 1 }
                </span>
                {#if post.categories && post.categories.length > 0}
                  <span class="text-xs font-sans font-bold tracking-widest uppercase text-primary">
                    // { post.categories[0] }
                  </span>
                {/if}
                <span class="text-xs font-mono text-white/50 tracking-wider">
                  { formatDate(post.date) }
                </span>
              </div>

              <h3 class="text-3xl lg:text-5xl font-serif tracking-tight text-white leading-[1.1] mb-6 drop-shadow-2xl max-w-2xl">
                { post.title }
              </h3>

              <p class="text-base text-white/80 font-sans font-light leading-relaxed max-w-2xl line-clamp-2 mb-8">
                { post.excerpt || post.description }
              </p>

              <div class="flex items-center gap-6">
                <div class="inline-flex pointer-events-auto items-center gap-3 px-8 py-4 rounded-full border border-primary text-primary text-sm font-sans font-bold tracking-widest uppercase group-hover/card:bg-primary group-hover/card:text-[#0d0c0c] transition-all transform w-fit shadow-xl">
                  Read Article
                  <ArrowRight class="w-4 h-4" />
                </div>
                <div class="h-px w-12 bg-white/10"></div>
                <span class="text-xs font-sans font-medium tracking-widest text-white/40 uppercase font-mono">5 min read</span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Mobile Navigation -->
  <div class="mt-16 md:hidden w-full max-w-6xl mx-auto px-6">
    <a
      href="/articles"
      class="flex items-center justify-center gap-3 h-14 w-full rounded-2xl border border-foreground/10 bg-foreground/5 text-foreground font-sans font-medium text-xs tracking-widest uppercase hover:bg-foreground/10 active:scale-[0.97] transition-all font-mono"
    >
      View All <span class="text-primary font-bold">Articles</span>
    </a>
  </div>
</section>

<style>
  /* Clean vertical writing mode layout for sidebar labels */
  .vertical-text {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }
</style>
