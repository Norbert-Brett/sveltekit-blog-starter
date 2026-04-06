<!-- This file renders each individual blog post for reading. Be sure to update the svelte:head below -->
<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ArrowLeft, ArrowRight, Clock, Calendar, Tag } from '@lucide/svelte';

  let { data } = $props();

  let title = $derived(data.meta.title);
  let excerpt = $derived(data.meta.excerpt);
  let date = $derived(data.meta.date);
  let categories = $derived(data.meta.categories);
  let PostContent = $derived(data.PostContent);
  
  let progressRef = $state();
  let articleRef = $state();

  onMount(() => {
    // Reveal Animation
    const tl = gsap.timeline();
    tl.fromTo('.article-header', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' })
      .fromTo('.article-cover', { scale: 1.05, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }, '-=0.8')
      .fromTo('.article-content', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '-=1');

    // Code Snippet Copy Functionality
    if (articleRef) {
      const codeBlocks = articleRef.querySelectorAll('.prose pre');
      codeBlocks.forEach((block) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative group/code my-14 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-[1.5rem]';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);
        
        // Remove margins/shadows from pre since wrapper handles it
        block.style.margin = '0';
        block.style.boxShadow = 'none';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'absolute top-4 right-4 bg-white/5 hover:bg-primary/10 text-white/40 hover:text-primary transition-all duration-300 px-4 py-2 rounded-xl opacity-0 group-hover/code:opacity-100 font-mono text-[10px] uppercase font-bold tracking-[0.2em] cursor-pointer border border-white/5 hover:border-primary/30 backdrop-blur-xl z-20';
        copyBtn.innerHTML = 'Copy';
        wrapper.appendChild(copyBtn);

        copyBtn.addEventListener('click', async () => {
          const code = block.querySelector('code')?.innerText || block.innerText;
          await navigator.clipboard.writeText(code);
          copyBtn.innerHTML = 'Copied!';
          copyBtn.classList.add('text-primary', 'border-primary/50', 'bg-primary/20');
          setTimeout(() => {
            copyBtn.innerHTML = 'Copy';
            copyBtn.classList.remove('text-primary', 'border-primary/50', 'bg-primary/20');
          }, 2000);
        });
      });
    }

    // Progress Bar
    const updateProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
      if (progressRef) gsap.to(progressRef, { width: scrolled, duration: 0.1, overwrite: 'auto' });
    };
    
    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  });
</script>

<svelte:head>
  <title>{title} | Norbert Potapov</title>
  <meta name="description" content={excerpt} />
</svelte:head>

<!-- Cinematic Progress Bar -->
<div class="fixed top-0 left-0 w-full h-[3px] z-[100] bg-white/5">
  <div bind:this={progressRef} class="h-full bg-primary shadow-[0_0_15px_rgba(201,168,76,0.8)]"></div>
</div>

<article bind:this={articleRef} class="relative bg-background overflow-hidden min-h-screen">
  
  <!-- Back Navigation (Desktop) -->
  <div class="fixed top-32 left-8 z-50 hidden xl:block">
    <a href="/articles" class="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 hover:text-primary transition-all group px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] shadow-2xl">
      <ArrowLeft class="w-4 h-4 transform group-hover:-translate-x-2 transition-transform" />
      Library
    </a>
  </div>

  <!-- Header Section -->
  <header class="article-header pt-32 pb-24 px-6 max-w-5xl mx-auto text-center relative">
    <!-- Back Navigation (Mobile/Tablet) -->
    <div class="xl:hidden mb-12 flex justify-center">
      <a href="/articles" class="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-primary bg-primary/10 px-6 py-2.5 rounded-full border border-primary/20">
        <ArrowLeft class="w-4 h-4" /> Go Back
      </a>
    </div>
    <div class="flex items-center justify-center gap-3 mb-8">
      {#if categories}
        {#each categories as category}
          <span class="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary bg-primary/5 px-4 py-1.5 rounded-full border border-primary/20">
            {category}
          </span>
        {/each}
      {/if}
    </div>

    <h1 class="text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-[-0.04em] text-white leading-[0.95] mb-12">
      {title}
    </h1>

    <div class="flex items-center justify-center gap-8 text-[11px] font-mono uppercase tracking-[0.3em] text-white/30">
      <div class="flex items-center gap-2">
        <Calendar class="w-3.5 h-3.5" />
        {date}
      </div>
      <div class="flex items-center gap-2">
        <Clock class="w-3.5 h-3.5" />
        5 Min Read
      </div>
    </div>
  </header>

  <!-- Cover Image Parallax -->
  {#if data.meta.coverImage}
    <div class="article-cover relative w-full max-w-7xl mx-auto px-6 mb-24 aspect-[21/9] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10"></div>
      <img
        src={data.meta.coverImage}
        alt={title}
        class="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  {/if}

  <!-- Prose Content -->
  <div class="article-content relative z-10 px-6 max-w-3xl mx-auto pb-32">
    <div class="prose prose-invert 
      prose-p:text-white/70 prose-p:leading-[1.8] prose-p:text-lg prose-p:font-sans prose-p:font-light 
      prose-headings:font-serif prose-headings:font-black prose-headings:tracking-[-0.02em] prose-headings:text-white prose-headings:mt-16 prose-headings:mb-8
      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-white/[0.02] prose-blockquote:py-6 prose-blockquote:px-10 prose-blockquote:rounded-r-3xl prose-blockquote:not-italic prose-blockquote:text-white/80
      prose-a:text-primary prose-a:font-medium prose-a:underline-offset-8 prose-a:decoration-primary/30 hover:prose-a:decoration-primary transition-all
      prose-img:rounded-[2rem] prose-img:border prose-img:border-white/5 prose-img:shadow-2xl
      prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-mono prose-code:text-sm
      max-w-none">
      <PostContent />
    </div>

    <!-- Tags Footer -->
    {#if categories}
      <footer class="mt-24 pt-12 border-t border-white/5 flex flex-wrap gap-4">
        <div class="flex items-center gap-3 mr-4 text-white/30">
          <Tag class="w-4 h-4" />
          <span class="text-[10px] font-mono uppercase tracking-widest">Indexed Under:</span>
        </div>
        {#each categories as category}
          <span class="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 border border-white/10 px-4 py-2 rounded-full hover:border-primary/40 hover:text-primary transition-all cursor-default">
            {category}
          </span>
        {/each}
      </footer>
    {/if}

    <!-- Bottom Navigation (Prev/Next) -->
    <nav class="mt-32 pt-20 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
      {#if data.prev}
        <a href="/articles/{data.prev.slug}" class="flex flex-col gap-4 group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all shadow-xl">
          <span class="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.3em] text-white/30 group-hover:text-primary transition-colors">
            <ArrowLeft class="w-3.5 h-3.5" /> Previous Story
          </span>
          <h4 class="text-2xl font-serif font-black text-white group-hover:text-primary transition-colors line-clamp-2">{data.prev.title}</h4>
        </a>
      {:else}
        <div class="placeholder invisible"></div>
      {/if}

      {#if data.next}
        <a href="/articles/{data.next.slug}" class="flex flex-col gap-4 group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all text-right items-end shadow-xl">
          <span class="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.3em] text-white/30 group-hover:text-primary transition-colors">
            Next Story <ArrowRight class="w-3.5 h-3.5" />
          </span>
          <h4 class="text-2xl font-serif font-black text-white group-hover:text-primary transition-colors line-clamp-2">{data.next.title}</h4>
        </a>
      {/if}
    </nav>
  </div>

  <!-- Perspective Backdrop Decoration -->
  <div class="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-primary/2 rounded-full blur-[150px] pointer-events-none"></div>
  <div class="absolute bottom-[10%] left-[-10%] w-[30vw] h-[30vw] bg-primary/2 rounded-full blur-[150px] pointer-events-none"></div>
</article>

<style>
  .article-header, .article-cover, .article-content {
    will-change: transform, opacity;
  }
  
  :global(.prose pre) {
    background: #0D0F0E !important;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 1.5rem !important;
    padding: 2.5rem !important;
    margin: 3.5rem 0 !important;
    overflow-x: auto;
    font-family: 'JetBrains Mono', monospace !important;
    line-height: 1.6;
    font-size: 0.95rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  :global(.prose pre code) {
    background: transparent !important;
    padding: 0 !important;
    border: none !important;
    color: inherit !important;
  }

  /* Custom Scrollbar for Code */
  :global(.prose pre::-webkit-scrollbar) {
    height: 8px;
  }
  :global(.prose pre::-webkit-scrollbar-track) {
    background: transparent;
  }
  :global(.prose pre::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
</style>
