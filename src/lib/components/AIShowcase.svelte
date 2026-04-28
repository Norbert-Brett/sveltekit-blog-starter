<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let sectionRef = $state(null);
  let ctx;

  let prompt = $state('');
  let isTyping = $state(false);
  let response = $state('');
  let hasAutoPlayed = $state(false);

  const stats = [
    { label: 'Models Trained', value: 12, suffix: '+' },
    { label: 'Tokens Processed', value: 50, suffix: 'B+' },
    { label: 'API Integrations', value: 30, suffix: '+' },
    { label: 'Accuracy Rate', value: 97, suffix: '%' }
  ];

  const samplePrompt = 'How would you architect a RAG pipeline for enterprise documents?';
  const sampleResponse = `I'd design a multi-stage pipeline:\n\n1. **Ingestion** — Parse PDFs/docs with LlamaParse, chunk with semantic splitting\n2. **Embedding** — Use text-embedding-3-large with 3072 dimensions\n3. **Storage** — Pinecone with metadata filtering for access control\n4. **Retrieval** — Hybrid search (dense + BM25) with re-ranking via Cohere\n5. **Generation** — Gemini 3 Flash with structured output, citation tracking, and guardrails`;

  const typeResponse = async () => {
    if (isTyping) return;
    prompt = samplePrompt;
    isTyping = true;
    response = '';
    for (let i = 0; i < sampleResponse.length; i++) {
      response += sampleResponse[i];
      await new Promise(r => setTimeout(r, 15));
    }
    isTyping = false;
  };

  onMount(() => {
    if (!browser || !sectionRef) return;

    ctx = gsap.context(() => {
      // 1. Initial layout measure
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

      // 2. Section label
      gsap.fromTo('.ai-label', 
        { y: 15, opacity: 0 }, 
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef, start: 'top 85%' }
        }
      );

      // 3. Title reveal
      gsap.fromTo('.ai-title', 
        { y: 30, opacity: 0 }, 
        {
          y: 0, opacity: 1, duration: 0.4,
          scrollTrigger: { trigger: sectionRef, start: 'top 70%' }
        }
      );

      // The Boot-Up: CRT-style terminal power on
      const terminalTimeline = gsap.timeline({
        scrollTrigger: { trigger: sectionRef, start: 'top 60%', toggleActions: 'play reverse play reverse' }
      });
      terminalTimeline
        .fromTo('.ai-terminal',
          { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0, filter: 'blur(10px)', scale: 0.95 },
          { clipPath: 'inset(50% 0% 50% 0%)', opacity: 1, filter: 'blur(2px)', scale: 1.02, duration: 0.4, ease: 'power2.inOut' }
        )
        .to('.ai-terminal',
          { clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)', scale: 1, duration: 0.8, ease: 'power4.out' },
          "+=0.1"
        );

      // 5. Stat cards stagger with clip-path reveal
      gsap.fromTo('.ai-stat-card', 
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 }, 
        {
          clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.8, stagger: 0.08, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef, start: 'top 50%' }
        }
      );

      // 6. Counter animations with glow burst on completion
      const counters = document.querySelectorAll('.ai-stat-num');
      counters.forEach((el, i) => {
        const stat = stats[i];
        if (!stat) return;
        
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef,
            start: 'top 60%',
            once: true
          },
          onUpdate: () => {
            el.innerText = Math.floor(obj.val);
          },
          onComplete: () => {
            // Glow burst effect on counter completion
            gsap.fromTo(el, 
              { scale: 1, textShadow: '0 0 0px rgba(41,151,255,0)' },
              { scale: 1.08, textShadow: '0 0 20px rgba(41,151,255,0.5)', duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 }
            );
          }
        });
      });

      // 7. Auto-trigger typing demo on scroll-enter (Hick's Law: removes decision to click)
      ScrollTrigger.create({
        trigger: sectionRef,
        start: 'top 40%',
        once: true,
        onEnter: () => {
          if (!hasAutoPlayed) {
            hasAutoPlayed = true;
            setTimeout(() => typeResponse(), 800);
          }
        }
      });
    }, sectionRef);

    return () => {
      if (ctx) ctx.revert();
    };
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<section bind:this={sectionRef} class="relative py-32 md:py-48 px-6 md:px-24 overflow-hidden bg-background">
  <!-- Unified Architectural Dot Grid (Dense) -->
  <div class="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-20">
    <div class="w-full h-full" 
         style="background-image: radial-gradient(var(--color-primary) 1.5px, transparent 1.5px); background-size: 1.5rem 1.5rem; mask-image: linear-gradient(to bottom, black 10%, transparent 90%); -webkit-mask-image: linear-gradient(to bottom, black 10%, transparent 90%);">
    </div>
  </div>

  <div class="max-w-6xl mx-auto relative z-10">
    <!-- Header -->
    <div class="mb-20">
      <span class="ai-label text-xs font-sans tracking-widest uppercase text-primary font-medium mb-4 flex items-center gap-3">
        <span class="w-8 h-px bg-primary/60"></span> AI / Machine Learning
      </span>
      <h2 class="ai-title text-5xl md:text-7xl lg:text-8xl font-sans font-bold tracking-tight leading-[0.9] text-white">
        AI Native
      </h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
      <!-- Interactive LLM Console -->
      <div class="ai-terminal relative group">
        <div class="relative rounded-2xl border border-white/5 bg-[#050505]/90 overflow-hidden backdrop-blur-xl transition-all duration-700 group-hover:border-primary/30 group-hover:shadow-[0_0_40px_-10px_rgba(41,151,255,0.15)]">
          <!-- Glass Reflection Sweep -->
          <div class="absolute inset-0 w-[200%] h-full bg-linear-to-r from-transparent via-white/4 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out pointer-events-none"></div>

          <!-- Cinematic Scanline (trending CRT terminal effect) -->
          <div class="absolute inset-0 pointer-events-none z-30 overflow-hidden opacity-[0.03]">
            <div class="w-full h-[2px] bg-primary/80 animate-scanline"></div>
          </div>

          <!-- Terminal Controls -->
          <div class="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <div class="w-3 h-3 rounded-full bg-red-500/60 animate-[pulse-glow_3s_ease-in-out_infinite_0.5s]"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500/60 animate-[pulse-glow_3s_ease-in-out_infinite_1s]"></div>
            <div class="w-3 h-3 rounded-full bg-green-500/60 animate-[pulse-glow_3s_ease-in-out_infinite_1.5s]"></div>
            <span class="ml-3 text-[10px] font-mono text-white/90">ai-console</span>
          </div>

          <!-- Console Content -->
          <div class="p-6">
            <div class="flex items-start gap-3 mb-6">
              <span class="text-primary font-mono text-sm mt-0.5">›</span>
              <div class="flex-1">
                {#if prompt}
                  <p class="text-sm font-mono text-white/80 mb-2">{ prompt }</p>
                {:else}
                  <p class="text-sm font-mono text-white/40 italic">Ask me about AI architecture...</p>
                {/if}
              </div>
            </div>

            <!-- Response Feed -->
            {#if response}
              <div class="pl-6 border-l border-primary/20">
                <pre class="text-sm font-mono text-white whitespace-pre-wrap leading-relaxed">{ response }</pre>
                {#if isTyping}
                  <span class="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle"></span>
                {/if}
              </div>
            {/if}

            <button
              class="mt-6 px-6 py-3 rounded-full border border-primary text-primary text-xs font-sans font-bold tracking-widest uppercase hover:bg-primary hover:text-[#0d0c0c] hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onclick={typeResponse}
              disabled={isTyping}
            >
              { isTyping ? 'Thinking...' : 'Run Prompt' }
            </button>
          </div>
        </div>
      </div>

      <!-- Performance Metrics Grid -->
      <div class="grid grid-cols-2 gap-6">
        {#each stats as stat, i}
          <div
            class="ai-stat-card flex flex-col justify-center p-8 rounded-2xl border border-white/5 bg-white/1 backdrop-blur-sm hover:border-primary/20 hover:bg-white/3 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(41,151,255,0.1)]"
          >
            <div class="flex items-end gap-1 mb-3">
              <span class="ai-stat-num text-4xl md:text-6xl font-sans font-bold tracking-tight text-white leading-none">0</span>
              <span class="text-xl md:text-2xl font-sans font-bold text-primary leading-none">{ stat.suffix }</span>
            </div>
            <span class="text-xs font-sans font-medium tracking-wide text-white/60 group-hover:text-white/80">{ stat.label }</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  pre {
    font-family: var(--font-mono);
  }
  .ai-stat-card {
    will-change: transform, opacity, clip-path;
  }
</style>
