<script>
  import { onMount, tick, onDestroy } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { ArrowRight } from '@lucide/svelte';

  let { posts = [] } = $props();
  let containerRef = $state();
  let ctx;

  const refreshTriggers = async () => {
    await tick();
    if (!containerRef) return;
    
    // Initialize context once
    if (!ctx) {
      ctx = gsap.context(() => {}, containerRef);
    }
    
    const unAnimatedCards = Array.from(containerRef.querySelectorAll('.post-card'))
      .filter(card => card.dataset.animated !== 'true');
      
    if (unAnimatedCards.length === 0) return;

    ctx.add(() => {
      unAnimatedCards.forEach(card => {
        // Mark as animated and remove inline opacity fallback
        card.dataset.animated = 'true';
        card.style.opacity = '';

        gsap.fromTo(card,
          { 
            y: 50, 
            opacity: 0, 
            scale: 0.98,
            filter: 'blur(10px)'
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              toggleActions: 'play none none none',
              once: true
            }
          }
        );
      });
    });
  };

  onMount(() => refreshTriggers());
  onDestroy(() => {
    if (ctx) ctx.revert();
  });

  $effect(() => {
    if (posts.length > 0) refreshTriggers();
  });
</script>

<div bind:this={containerRef} class="grid grid-cols-1 md:grid-cols-2 gap-10">
  {#each posts as post (post.slug)}
    <a href="/articles/{post.slug}" class="post-card group block h-full overflow-hidden rounded-3xl" style="opacity: 0;">
      <article class="h-full bg-white/2 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl hover:border-primary/40 transition-all duration-700 flex flex-col shadow-2xl hover:shadow-[0_0_40px_rgba(41,151,255,0.08)] relative">
        
        <!-- Hover Shine Effect -->
        <div class="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

        {#if post.coverImage}
          <div class="w-full relative overflow-hidden aspect-16/10">
            <div class="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500 z-10"></div>
            <img
              src={post.coverImage}
              alt={post.title}
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              loading="lazy"
            />
          </div>
        {/if}
        
        <div class="p-8 md:p-10 grow flex flex-col">
          <div class="flex items-center gap-3 mb-6">
            {#if post.categories && post.categories.length > 0}
              <span class="text-xs font-sans font-semibold tracking-widest text-primary uppercase">{post.categories[0]}</span>
            {/if}
            <span class="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <time class="text-xs font-sans font-medium tracking-wide text-white/50">{post.date}</time>
          </div>

          <h2 class="text-3xl font-sans font-bold text-white mb-4 group-hover:text-primary transition-colors duration-500 leading-tight line-clamp-2">
            {post.title}
          </h2>

          <p class="text-white/60 font-sans font-light leading-relaxed mb-8 grow line-clamp-3">
            {post.excerpt}
          </p>

          <div class="mt-auto flex items-center text-xs font-sans font-semibold tracking-widest text-white group-hover:text-primary transition-all gap-2 uppercase">
            Read Article
            <ArrowRight class="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500" />
          </div>
        </div>
      </article>
    </a>
  {/each}
</div>

<style>
  .post-card {
    will-change: transform, opacity;
  }
</style>