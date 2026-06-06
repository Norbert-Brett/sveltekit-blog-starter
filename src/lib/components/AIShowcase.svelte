<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let sectionRef = $state(null);
  let terminalBodyRef = $state(null);
  let ctx;

  let selectedFile = $state('rag'); // 'rag', 'finetuning', 'agentic'
  let isExecuting = $state(false);
  let isTyping = $state(false);
  let terminalLines = $state([]);
  let typedResponse = $state('');
  let latency = $state('--');
  let tokens = $state('--');
  let hasAutoPlayed = $state(false);

  const stats = [
    { label: 'Models Trained', value: 12, suffix: '+' },
    { label: 'Tokens Processed', value: 50, suffix: 'B+' },
    { label: 'API Integrations', value: 30, suffix: '+' },
    { label: 'Accuracy Rate', value: 97, suffix: '%' }
  ];

  const files = [
    {
      id: 'rag',
      name: 'rag_pipeline.sh',
      icon: '🐚',
      prompt: 'How would you architect a RAG pipeline for enterprise documents?',
      steps: [
        { text: './run_pipeline.sh --mode enterprise-rag', type: 'command' },
        { text: 'Initializing connection to Gemini-3.5-Flash...', type: 'info' },
        { text: 'Generating query embeddings (3072d)...', type: 'info' },
        { text: 'Searching Pinecone vector space -> 3 chunks found.', type: 'success' },
        { text: 'Applying Cohere-Rerank-v3 (re-score > 0.75)...', type: 'success' },
        { text: 'Synthesizing response with grounded context...', type: 'info' }
      ],
      response: `I'd design a multi-stage pipeline:\n\n1. **Ingestion** — Parse PDFs/docs with LlamaParse, chunk with semantic splitting\n2. **Embedding** — Use text-embedding-3-large with 3072 dimensions\n3. **Storage** — Pinecone with metadata filtering for access control\n4. **Retrieval** — Hybrid search (dense + BM25) with re-ranking via Cohere\n5. **Generation** — Gemini 3.5 Flash with structured output and grounding`,
      latency: '180ms',
      tokens: '242'
    },
    {
      id: 'finetuning',
      name: 'fine_tuning.py',
      icon: '🐍',
      prompt: 'When should we fine-tune a model versus using RAG?',
      steps: [
        { text: 'python fine_tuning_selector.py --eval', type: 'command' },
        { text: 'Comparing data dynamic frequency vs task complexity...', type: 'info' },
        { text: 'Evaluating domain-specific terminology requirements...', type: 'info' },
        { text: 'Calculating inference token overhead savings... OK', type: 'success' },
        { text: 'Generating trade-off decision matrix...', type: 'info' }
      ],
      response: `RAG vs. Fine-tuning decision guide:\n\n- **RAG** is ideal for accessing dynamic external data, ensuring factual accuracy with source citations, and simple setup.\n- **Fine-Tuning** is ideal for teaching custom styles, strict output formats, specific domain terminology, and reducing latency/costs.\n- **Hybrid Approach**: Use RAG to fetch context, and fine-tune to teach the model how to follow specific formatting and reasoning patterns.`,
      latency: '145ms',
      tokens: '198'
    },
    {
      id: 'agentic',
      name: 'agent_swarm.js',
      icon: '🟨',
      prompt: 'What is your approach to multi-agent orchestrations?',
      steps: [
        { text: 'node agent_swarm.js --nodes=5', type: 'command' },
        { text: 'Spawning worker agent threads... OK (5 active nodes)', type: 'success' },
        { text: 'Establishing shared LangGraph state channel...', type: 'info' },
        { text: 'Running task routing and evaluator loops... OK', type: 'success' },
        { text: 'Consolidating agent consensus...', type: 'info' }
      ],
      response: `Multi-agent system architecture:\n\n1. **Routing** — A supervisor agent directs tasks to specialized worker nodes.\n2. **Specialization** — Independent nodes focus on specific skills (e.g. searching, coding).\n3. **State Management** — Use a graph-based state (like LangGraph) for flexible cycles.\n4. **Human-in-the-loop** (HITL) — Place gatekeepers for critical write/execute actions.\n5. **Self-Correction** — Evaluator agents check outputs against constraints and retry.`,
      latency: '220ms',
      tokens: '315'
    }
  ];

  const selectFile = (id, autoRun = false) => {
    if (isExecuting) return;
    selectedFile = id;
    const file = files.find(f => f.id === id);
    if (!file) return;

    typedResponse = '';
    terminalLines = [
      { text: `loaded file: ${file.name}`, type: 'info' },
      { text: `prompt: "${file.prompt}"`, type: 'info' },
      { text: `Press 'Run' to execute model inference.`, type: 'info' }
    ];
    latency = '--';
    tokens = '--';

    if (autoRun) {
      runFile(id);
    }
  };

  const runFile = async (id) => {
    if (isExecuting) return;
    isExecuting = true;
    isTyping = false;
    typedResponse = '';

    const file = files.find(f => f.id === id);
    if (!file) {
      isExecuting = false;
      return;
    }

    latency = 'running...';
    tokens = 'running...';

    // 1. Clear preview and show command execution start
    terminalLines = [];
    
    // 2. Output simulation logs
    for (let i = 0; i < file.steps.length; i++) {
      terminalLines = [...terminalLines, file.steps[i]];
      await new Promise(r => setTimeout(r, 200 + Math.random() * 150));
    }

    // 3. Start response typing
    isTyping = true;
    const responseText = file.response;
    for (let i = 0; i < responseText.length; i++) {
      typedResponse += responseText[i];
      await new Promise(r => setTimeout(r, 10));
    }
    isTyping = false;

    // 4. Complete execution metadata
    latency = file.latency;
    tokens = file.tokens;
    isExecuting = false;

    // 5. Border glow animation feedback
    if (browser) {
      gsap.fromTo('.ai-terminal-shell',
        { borderColor: 'rgba(255, 255, 255, 0.05)' },
        { borderColor: 'rgba(212, 176, 85, 0.3)', duration: 0.4, yoyo: true, repeat: 1 }
      );
    }
  };

  // Scroll to bottom effect
  $effect(() => {
    if (terminalLines.length || typedResponse) {
      setTimeout(() => {
        if (terminalBodyRef) {
          terminalBodyRef.scrollTop = terminalBodyRef.scrollHeight;
        }
      }, 10);
    }
  });

  onMount(() => {
    if (!browser || !sectionRef) return;

    // Pre-initialize first file preview state
    selectFile('rag', false);

    const isMobileDevice = window.innerWidth < 768 || matchMedia('(pointer: coarse)').matches;

    ctx = gsap.context(() => {
      // Refresh scroll trigger cache
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

      // Section animations
      gsap.fromTo('.ai-label', 
        { y: 15, opacity: 0 }, 
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef, start: 'top 85%' }
        }
      );

      gsap.fromTo('.ai-title', 
        { y: 30, opacity: 0 }, 
        {
          y: 0, opacity: 1, duration: 0.4,
          scrollTrigger: { trigger: sectionRef, start: 'top 70%' }
        }
      );

      if (isMobileDevice) {
        gsap.fromTo('.ai-terminal',
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef, start: 'top 75%' }
          }
        );

        gsap.fromTo('.ai-stat-card', 
          { opacity: 0, y: 20 }, 
          {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef, start: 'top 75%' }
          }
        );
      } else {
        gsap.fromTo('.ai-terminal',
          { opacity: 0, scale: 0.96, y: 35 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef,
              start: 'top 65%',
              once: true
            }
          }
        );

        gsap.fromTo('.ai-stat-card', 
          { opacity: 0, y: 40 }, 
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef,
              start: 'top 60%',
              once: true
            }
          }
        );
      }

      // Counters animation (now with gold accent color glow pulse)
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
            if (isMobileDevice) return;
            // Glow burst effect using the premium gold accent color
            gsap.fromTo(el, 
              { textShadow: '0 0 0px rgba(212,176,85,0)' },
              { textShadow: '0 0 25px rgba(212,176,85,0.7)', duration: 0.4, ease: 'power2.out', yoyo: true, repeat: 1 }
            );
          }
        });
      });

      // Auto-trigger typing demo on scroll-enter
      ScrollTrigger.create({
        trigger: sectionRef,
        start: 'top 40%',
        once: true,
        onEnter: () => {
          if (!hasAutoPlayed) {
            hasAutoPlayed = true;
            setTimeout(() => runFile(selectedFile), 800);
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
      <h2 class="ai-title text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight leading-[0.9] text-foreground">
        AI Native
      </h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      <!-- Interactive LLM Console -->
      <div class="ai-terminal relative group w-full h-[500px] shrink-0">
        <div class="ai-terminal-shell relative rounded-2xl border border-black/10 dark:border-white/5 bg-muted/90 dark:bg-[#050505]/95 overflow-hidden backdrop-blur-xl transition-all duration-700 group-hover:border-primary/30 group-hover:shadow-[0_0_40px_-10px_rgba(212,176,85,0.15)] h-[500px] flex flex-col justify-between">
          <!-- Glass Reflection Sweep -->
          <div class="absolute inset-0 w-[200%] h-full bg-linear-to-r from-transparent via-white/10 dark:via-white/4 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out pointer-events-none"></div>

          <!-- Cinematic Scanline -->
          <div class="absolute inset-0 pointer-events-none z-30 overflow-hidden opacity-[0.03]">
            <div class="w-full h-[2px] bg-primary/80 animate-scanline"></div>
          </div>

          <!-- Terminal Control Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20 shrink-0">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div class="w-3 h-3 rounded-full bg-green-500/60"></div>
              <span class="ml-2 text-[10px] font-mono text-foreground/50 dark:text-white/50">visitor@norbert.dev: ~/ai-showcase</span>
            </div>
            <div class="text-[9px] font-mono text-accent/50 uppercase tracking-widest">// SHELL_ACTIVE</div>
          </div>

          <!-- Tabs & Run Row -->
          <div class="flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-black/10 dark:bg-black/45 px-4 py-2 shrink-0">
            <div class="flex gap-2 overflow-x-auto scrollbar-hide py-1">
              {#each files as file}
                <button
                  onclick={() => selectFile(file.id)}
                  disabled={isExecuting}
                  class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 disabled:opacity-50
                    {selectedFile === file.id 
                      ? 'bg-accent/15 border-accent/30 text-accent font-medium shadow-[0_0_10px_rgba(212,176,85,0.05)]' 
                      : 'bg-transparent border-transparent text-foreground/45 hover:text-foreground hover:bg-foreground/5 dark:text-white/45 dark:hover:text-white/80 dark:hover:bg-white/5'}"
                >
                  <span class="text-[10px]">{file.icon}</span>
                  {file.name}
                </button>
              {/each}
            </div>

            <button
              onclick={() => runFile(selectedFile)}
              disabled={isExecuting}
              class="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent text-[#181715] text-xs font-sans font-bold tracking-wider uppercase transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(212,176,85,0.3)] shadow-[0_0_5px_rgba(212,176,85,0.1)] shrink-0"
            >
              {#if isExecuting}
                <span class="inline-block w-2.5 h-2.5 border-2 border-[#181715] border-t-transparent rounded-full animate-spin"></span>
                Running...
              {:else}
                <span>▶</span> Run
              {/if}
            </button>
          </div>

          <div 
            bind:this={terminalBodyRef}
            class="flex-1 min-h-0 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/5 dark:bg-black/10 select-text"
            data-lenis-prevent
          >
            {#each terminalLines as line}
              {#if line.type === 'command'}
                <div class="text-accent font-mono text-sm flex items-center gap-2">
                  <span class="text-foreground/45 dark:text-white/45 font-medium">visitor@norbert.dev:~$</span>
                  <span>{line.text}</span>
                </div>
              {:else if line.type === 'info'}
                <div class="text-foreground/60 dark:text-white/50 font-mono text-sm pl-4 flex items-start gap-2">
                  <span class="text-accent/30 mt-0.5">›</span>
                  <span>{line.text}</span>
                </div>
              {:else if line.type === 'success'}
                <div class="text-emerald-600 dark:text-emerald-400/80 font-mono text-sm pl-4 flex items-start gap-2">
                  <span class="mt-0.5">✓</span>
                  <span>{line.text}</span>
                </div>
              {:else if line.type === 'warn'}
                <div class="text-amber-600 dark:text-amber-400/80 font-mono text-sm pl-4 flex items-start gap-2">
                  <span class="mt-0.5">⚠</span>
                  <span>{line.text}</span>
                </div>
              {/if}
            {/each}

            {#if typedResponse}
              <div class="pl-4 border-l border-accent/30 text-foreground/90 dark:text-white/90 font-mono text-sm whitespace-pre-wrap leading-relaxed select-text">
                {typedResponse}
                {#if isTyping}
                  <span class="inline-block w-2 h-4 bg-accent animate-blink ml-1 align-middle"></span>
                {/if}
              </div>
            {/if}
          </div>

          <!-- Terminal Footer Status Bar -->
          <div class="flex items-center justify-between px-4 py-2.5 bg-black/10 dark:bg-black/40 border-t border-black/5 dark:border-white/5 text-[9px] font-mono text-foreground/45 dark:text-white/40 select-none shrink-0">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full {isExecuting ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}"></span>
                STATUS: {isExecuting ? 'PROCESSING' : 'READY'}
              </span>
              <span>MODEL: GEMINI-3.5-FLASH</span>
            </div>
            <div class="flex items-center gap-4">
              <span>LATENCY: {latency}</span>
              <span>TOKENS: {tokens}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Metrics Grid -->
      <div class="grid grid-cols-2 gap-6 items-stretch">
        {#each stats as stat, i}
          <div
            class="ai-stat-card flex flex-col justify-center p-8 rounded-2xl glass-panel transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(212,176,85,0.08)] hover:border-primary/30"
          >
            <div class="flex items-end gap-1 mb-3">
              <span class="ai-stat-num text-4xl md:text-6xl font-sans font-bold tracking-tight text-foreground leading-none">0</span>
              <span class="text-xl md:text-2xl font-sans font-bold text-primary leading-none">{ stat.suffix }</span>
            </div>
            <span class="text-xs font-sans font-medium tracking-wide text-foreground/60 group-hover:text-foreground/85">{ stat.label }</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  /* Custom scrollbar for the terminal content */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  :global(html[data-theme="dark"]) .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(212, 176, 85, 0.2); /* Muted Gold */
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
  :global(html[data-theme="dark"]) .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(212, 176, 85, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.03);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(212, 176, 85, 0.35); /* Brighter Gold */
  }

  /* Blinking terminal cursor */
  @keyframes blink {
    50% { opacity: 0; }
  }
  .animate-blink {
    animation: blink 1s step-end infinite;
  }
</style>
