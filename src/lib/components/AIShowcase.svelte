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

      // 4. Terminal card entrance
      gsap.fromTo('.ai-terminal', 
        { y: 40, opacity: 0, scale: 0.98 }, 
        {
          y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef, start: 'top 55%', scrub: 0.5 }
        }
      );

      // 5. Stat cards stagger
      gsap.fromTo('.ai-stat-card', 
        { y: 20, opacity: 0, scale: 0.95 }, 
        {
          y: 0, opacity: 1, scale: 1, duration: 0.3, stagger: 0.03, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: sectionRef, start: 'top 50%' }
        }
      );

      // 6. Counter animations
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
          }
        });
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
  <!-- Interactive background light -->
  <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[150px] pointer-events-none animate-[glow-breathe_10s_ease-in-out_infinite]"></div>

  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-20">
      <span class="ai-label text-xs font-mono tracking-[0.4em] uppercase text-primary font-medium mb-4 flex items-center gap-3">
        <span class="w-8 h-px bg-primary/60"></span> AI / Machine Learning
      </span>
      <h2 class="ai-title text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-tighter leading-[0.9] text-white uppercase">
        AI Native
      </h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
      <!-- Interactive LLM Console -->
      <div class="ai-terminal relative">
        <!-- Accent glow behind terminal -->
        <div class="absolute -inset-4 bg-primary/[0.03] rounded-3xl blur-[60px] animate-[pulse-glow_4s_ease-in-out_infinite] pointer-events-none"></div>

        <div class="relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden backdrop-blur-sm">
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

            <!-- Execution Trigger -->
            <button
              class="mt-6 px-6 py-3 rounded-full bg-primary text-black text-[10px] font-mono font-bold tracking-[0.15em] uppercase hover:bg-[#b8983f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            class="ai-stat-card flex flex-col justify-center p-8 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm hover:border-primary/20 hover:bg-white/[0.03] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(201,168,76,0.1)]"
          >
            <div class="flex items-end gap-1 mb-3">
              <span class="ai-stat-num text-4xl md:text-6xl font-serif font-black text-white leading-none">0</span>
              <span class="text-xl md:text-2xl font-serif font-bold text-primary leading-none">{ stat.suffix }</span>
            </div>
            <span class="text-[10px] font-mono tracking-[0.2em] uppercase text-white/60 group-hover:text-white/80 uppercase">{ stat.label }</span>
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
    will-change: transform, opacity;
  }
</style>
