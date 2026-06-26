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
  let featuredRef = $state(null);
  let gridRef = $state(null);
  let isMobile = $state(false);
  let ctx;
  let mouseX = $state(0);
  let mouseY = $state(0);

  // Featured post is the first; remaining fill the stacked list
  let featured = $derived(posts[0] || null);
  let remaining = $derived(posts.slice(1, 5));

  onMount(() => {
    if (!browser) return;

    isMobile = window.innerWidth < 768 || matchMedia('(pointer: coarse)').matches;

    const handleResize = () => {
      isMobile = window.innerWidth < 768 || matchMedia('(pointer: coarse)').matches;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  $effect(() => {
    if (!browser || !sectionRef) return;

    ctx = gsap.context(() => {
      // Section label clip-reveal
      gsap.fromTo('.insights-label',
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef, start: 'top 75%' }
        }
      );

      // CTA button pop
      gsap.fromTo('.insights-cta',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.5, delay: 0.15, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: sectionRef, start: 'top 72%' }
        }
      );

      // Featured card cinematic reveal
      if (featuredRef) {
        gsap.fromTo(featuredRef,
          { opacity: 0, y: 60, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef, start: 'top 65%' }
          }
        );
      }

      // Stacked list items stagger in
      gsap.fromTo('.stack-item',
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef || sectionRef, start: 'top 70%' }
        }
      );
    }, sectionRef);

    return () => {
      if (ctx) ctx.revert();
    };
  });

  // Mouse spotlight tracking for the featured card
  function handleMouseMove(e) {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
</script>

<!-- ── LATEST INSIGHTS ─────────────────────────────────────────────────── -->
<section
  bind:this={sectionRef}
  class="relative bg-background z-20 py-28 md:py-40 overflow-hidden"
>
  <!-- Subtle grid backdrop -->
  <div class="absolute inset-0 z-0 pointer-events-none opacity-[0.025]">
    <div class="w-full h-full"
         style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 80px 80px;">
    </div>
  </div>

  <div class="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

    <!-- ── HEADER ───────────────────────────────────────────── -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
      <div>
        <span class="insights-label text-xs font-sans tracking-widest uppercase text-primary font-medium mb-4 flex items-center gap-3">
          <span class="w-8 h-px bg-primary/60"></span> Writing
        </span>
        <h2
          use:splitReveal={{ type: 'chars', delay: 0.2 }}
          class="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight leading-[0.9] text-foreground"
        >
          Latest Insights
        </h2>
      </div>

      <a
        href="/articles"
        use:magnetic={{ strength: 0.5, textStrength: 0.2 }}
        class="insights-cta shrink-0 flex items-center justify-center w-20 h-20 rounded-full border border-primary text-primary text-xs font-sans font-bold tracking-widest uppercase hover:bg-primary hover:text-[#0d0c0c] hover:border-primary hover:shadow-[0_0_20px_rgba(212,176,85,0.4)] active:scale-[0.97] transition-all duration-300 interactive"
      >
        <span class="magnetic-text font-bold">All</span>
      </a>
    </div>

    <!-- ── MAIN LAYOUT ─────────────────────────────────────── -->
    <div bind:this={gridRef} class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

      <!-- ── FEATURED HERO CARD (left, spans 7 cols) ─────── -->
      {#if featured}
        <a
          bind:this={featuredRef}
          href="/articles/{featured.slug}/"
          onmousemove={handleMouseMove}
          class="featured-card lg:col-span-7 relative rounded-3xl overflow-hidden group/feat min-h-[420px] md:min-h-[520px] lg:min-h-[600px] flex flex-col justify-end border border-white/[0.06] hover:border-primary/30 transition-all duration-700 hover:shadow-[0_0_80px_rgba(212,176,85,0.08)]"
          style="--mx: {mouseX}px; --my: {mouseY}px;"
        >
          <!-- Background image with Ken Burns -->
          <div class="absolute inset-0 w-full h-full bg-[#0A0D0B] overflow-hidden">
            {#if featured.coverImage}
              <img
                src={featured.coverImage}
                alt={featured.title}
                loading="lazy"
                class="w-full h-full object-cover transition-[transform,filter] duration-[2s] ease-out group-hover/feat:scale-[1.04] blur-[0.5px] group-hover/feat:blur-0 grayscale-[0.3] group-hover/feat:grayscale-0"
              />
            {/if}
            <!-- Cinematic gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
          </div>

          <!-- Radial mouse spotlight -->
          <div class="absolute inset-0 opacity-0 group-hover/feat:opacity-100 transition-opacity duration-700 pointer-events-none"
               style="background: radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(212,176,85,0.06), transparent 70%);">
          </div>

          <!-- Top-left badge -->
          <div class="absolute top-6 left-6 z-10 flex items-center gap-3">
            <span class="px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-[9px] font-sans font-bold tracking-[0.2em] text-[#0d0c0c] uppercase rounded-full">
              Featured
            </span>
            {#if featured.categories && featured.categories.length > 0}
              <span class="px-3 py-1.5 bg-white/10 backdrop-blur-md text-[9px] font-sans font-semibold tracking-widest text-white/80 uppercase rounded-full border border-white/10">
                {featured.categories[0]}
              </span>
            {/if}
          </div>

          <!-- Content overlay -->
          <div class="relative z-10 p-8 md:p-12 pointer-events-none">
            <div class="flex items-center gap-3 mb-5">
              <span class="text-[10px] font-mono text-white/50 tracking-wider uppercase">
                {formatDate(featured.date)}
              </span>
              <span class="w-1 h-1 rounded-full bg-primary/60"></span>
              <span class="text-[10px] font-sans font-medium text-white/50 tracking-widest uppercase">
                {featured.readingTime || 5} min read
              </span>
            </div>

            <h3 class="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight text-white leading-[1.1] mb-5 drop-shadow-2xl max-w-xl group-hover/feat:text-primary/95 transition-colors duration-700">
              {featured.title}
            </h3>

            <p class="text-sm md:text-base text-white/70 font-sans font-light leading-relaxed max-w-lg line-clamp-2 mb-8">
              {featured.excerpt || featured.description}
            </p>

            <div class="inline-flex pointer-events-auto items-center gap-3 px-7 py-3.5 rounded-full border border-primary/80 text-primary text-xs font-sans font-bold tracking-[0.15em] uppercase group-hover/feat:bg-primary group-hover/feat:text-[#0d0c0c] transition-all duration-500 w-fit">
              Read Article
              <ArrowRight class="w-4 h-4 transition-transform duration-300 group-hover/feat:translate-x-1" />
            </div>
          </div>
        </a>
      {/if}

      <!-- ── STACKED LIST (right, spans 5 cols) ──────────── -->
      <div class="lg:col-span-5 flex flex-col gap-0">
        <!-- Column header -->
        <div class="hidden lg:flex items-center gap-3 mb-6 px-1">
          <span class="text-[9px] font-mono tracking-[0.3em] text-foreground/30 uppercase">// Recent entries</span>
          <div class="h-px flex-1 bg-border/40"></div>
          <span class="text-[9px] font-mono text-foreground/30">{remaining.length}</span>
        </div>

        {#each remaining as post, index}
          <a
            href="/articles/{post.slug}/"
            class="stack-item group/stack relative flex gap-5 py-6 px-4 rounded-2xl hover:bg-foreground/[0.03] transition-all duration-500 border border-transparent hover:border-border/40"
          >
            <!-- Number index -->
            <div class="shrink-0 w-10 h-10 rounded-xl bg-foreground/[0.04] border border-foreground/[0.06] flex items-center justify-center group-hover/stack:border-primary/30 group-hover/stack:bg-primary/[0.06] transition-all duration-500">
              <span class="text-xs font-mono font-bold text-foreground/40 group-hover/stack:text-primary transition-colors duration-500">
                0{index + 2}
              </span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[9px] font-mono text-foreground/40 tracking-wider uppercase">
                  {formatDate(post.date)}
                </span>
                {#if post.categories && post.categories.length > 0}
                  <span class="text-[9px] font-sans font-bold text-primary/70 tracking-widest uppercase">
                    // {post.categories[0]}
                  </span>
                {/if}
              </div>

              <h3 class="text-base md:text-lg font-serif tracking-tight text-foreground leading-snug line-clamp-2 mb-2 group-hover/stack:text-primary/90 transition-colors duration-500">
                {post.title}
              </h3>

              <p class="text-xs text-foreground/50 font-sans font-light leading-relaxed line-clamp-1">
                {post.excerpt || post.description}
              </p>
            </div>

            <!-- Arrow indicator -->
            <div class="shrink-0 self-center opacity-0 group-hover/stack:opacity-100 transition-all duration-500 -translate-x-2 group-hover/stack:translate-x-0">
              <ArrowRight class="w-4 h-4 text-primary" />
            </div>

            <!-- Bottom separator -->
            {#if index < remaining.length - 1}
              <div class="absolute bottom-0 left-4 right-4 h-px bg-border/20"></div>
            {/if}
          </a>
        {/each}

        <!-- Mobile CTA -->
        <div class="mt-6 lg:hidden">
          <a
            href="/articles"
            class="flex items-center justify-center gap-3 h-14 w-full rounded-2xl border border-foreground/10 bg-foreground/5 text-foreground font-sans font-medium text-xs tracking-widest uppercase hover:bg-foreground/10 active:scale-[0.97] transition-all"
          >
            View All <span class="text-primary font-bold">Articles</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .featured-card {
    background: linear-gradient(135deg, rgba(10,13,11,0.95), rgba(24,23,21,0.9));
  }
</style>
