<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import FoundationalQuote from '$lib/components/FoundationalQuote.svelte';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }
  import { MetaTags } from 'svelte-meta-tags';

  // --- DATA ---
  const stats = [
    { number: '05+', label: 'Years Experience', code: 'EXP_LVL' },
    { number: '15+', label: 'Tech Stack', code: 'SYS_MOD' },
    { number: '01', label: 'Class Honours', code: 'ACD_RNK' },
    { number: '03', label: 'Languages', code: 'LNG_DAT' }
  ];

  const values = [
    { icon: 'target', title: 'Purpose-Driven', text: 'Every line of code serves a business goal. I build with intent, not impulse.' },
    { icon: 'shield-check', title: 'Battle-Tested', text: '11+ years of managing high-pressure teams taught me resilience and systems thinking.' },
    { icon: 'sparkles', title: 'Craft-Obsessed', text: 'I obsess over the details, from pixel-perfect UI to optimised database queries.' }
  ];

  const skillCategories = [
    {
      name: 'Frontend Systems',
      code: 'FE_SYS',
      icon: 'layout',
      skills: [
        { name: 'Svelte/SvelteKit', level: 95 },
        { name: 'Vue/Nuxt', level: 95 },
        { name: 'React', level: 80 },
        { name: 'Tailwind', level: 98 },
        { name: 'GSAP', level: 92 },
        { name: 'TypeScript', level: 88 }
      ]
    },
    {
      name: 'Backend Core',
      code: 'BE_CORE',
      icon: 'server',
      skills: [
        { name: 'Python', level: 92 },
        { name: 'Django', level: 88 },
        { name: 'Go', level: 80 },
        { name: 'Node.js', level: 82 },
        { name: 'PostgreSQL', level: 88 },
        { name: 'Java', level: 80 }
      ]
    },
    {
      name: 'AI Engineering',
      code: 'AI_SYS',
      icon: 'brain',
      skills: [
        { name: 'Enterprise AI Integration', level: 95 },
        { name: 'LLM Fine-Tuning & Setup', level: 88 },
        { name: 'Agentic AI Workflows', level: 92 },
        { name: 'RAG Setup & Optimisation', level: 90 },
        { name: 'Multi-Agent Orchestration', level: 88 },
        { name: 'AI Security & Guardrails', level: 85 }
      ]
    },
    {
      name: 'DevOps & Cloud',
      code: 'OPS_CLD',
      icon: 'cloud',
      skills: [
        { name: 'AWS', level: 80 },
        { name: 'Docker', level: 88 },
        { name: 'CI/CD', level: 80 },
        { name: 'Linux', level: 85 },
        { name: 'Nginx', level: 78 },
        { name: 'Git', level: 95 }
      ]
    },
    {
      name: 'Leadership',
      code: 'LDR_SHP',
      icon: 'users',
      skills: [
        { name: 'Operations Mgmt', level: 98 },
        { name: 'Team Strategy', level: 95 },
        { name: 'Agile/Scrum', level: 92 },
        { name: 'Mentoring', level: 90 },
        { name: 'Code Review', level: 88 },
        { name: 'Hiring', level: 85 }
      ]
    }
  ];

  const timeline = [
    { year: '2025', role: 'Logistics Operations', company: 'Cel-Trade 97', desc: 'Managing logistics operations and supply chain optimisation across multiple regions.', icon: 'truck', active: true },
    { year: '2023', role: 'Freelance Engineer', company: 'Self-Employed', desc: 'Architecting full-stack applications for diverse clients using Svelte, Nuxt & Python ecosystems.', icon: 'code', active: false },
    { year: '2022', role: 'Tech Support Engineer', company: 'Mila', desc: 'Optimised support workflows, reducing ticket resolution time by 15% through automation.', icon: 'headphones', active: false },
    { year: '2019', role: 'CS Degree', company: 'University of Roehampton', desc: 'Graduated with 80%+ average. First Class Honours in Computer Science.', icon: 'graduation-cap', active: false },
    { year: '2013', role: 'Operations Manager', company: 'McDonalds / KFC', desc: '11+ years of high-volume team leadership and operational excellence serving 1000+ daily customers.', icon: 'briefcase', active: false }
  ];

  let pageRef = $state(null);
  let ctx;

  const handleMouseMove = (e) => {
    const card = e.target.closest('.spotlight-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const nameChars = 'Norbert Brett'.split('');

  onMount(() => {
    if (!browser || !pageRef) return;

    ctx = gsap.context(() => {
      // 1. HERO
      const heroTL = gsap.timeline({ delay: 0.05 });
      heroTL.fromTo('.hero-eyebrow', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out' });
      heroTL.fromTo('.hero-char', { y: 40, opacity: 0, rotateX: -30 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.5, stagger: 0.012, ease: 'expo.out' }, '-=0.3');
      heroTL.fromTo('.hero-bio', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out' }, '-=0.4');
      heroTL.fromTo('.hero-stat', { y: 15, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: 'expo.out' }, '-=0.3');
      
      gsap.to('.hero-bg-img', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1.5 }
      });

      // 2. STORY
      gsap.fromTo('.story-pullquote', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'expo.out', scrollTrigger: { trigger: '.story-section', start: 'top 85%' } });
      gsap.fromTo('.story-para', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.story-section', start: 'top 80%' } });
      gsap.fromTo('.value-card', { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.2)', scrollTrigger: { trigger: '.values-grid', start: 'top 85%' } });

      // 3. SKILLS
      gsap.fromTo('.skills-header', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out', scrollTrigger: { trigger: '.skills-section', start: 'top 72%' } });
      gsap.fromTo('.skill-category-card', { y: 40, opacity: 0, rotateX: -5 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.5, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.skills-grid', start: 'top 75%', toggleActions: 'play none none reverse' } });
      
      document.querySelectorAll('.skill-bar-fill').forEach((bar) => {
        const level = bar.getAttribute('data-level');
        const width = level + '%';
        gsap.fromTo(bar, { width: '0%' }, { width, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: bar, start: 'top 85%' } });
      });

      // 4. TIMELINE
      gsap.fromTo('.timeline-line', { height: 0 }, { height: '100%', ease: 'none', scrollTrigger: { trigger: '.timeline-container', start: 'top center', end: 'bottom center', scrub: true } });
      
      document.querySelectorAll('.timeline-entry').forEach((entry, i) => {
        const fromX = i % 2 === 0 ? -40 : 40;
        gsap.fromTo(entry, { x: fromX, opacity: 0, scale: 0.98 }, { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out', scrollTrigger: { trigger: entry, start: 'top 82%' } });
      });
      
      document.querySelectorAll('.timeline-dot').forEach((dot) => {
        gsap.fromTo(dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, transformOrigin: "center center", ease: 'elastic.out(1, 0.5)', scrollTrigger: { trigger: dot, start: 'top 82%' } });
      });

      // 5. DIVIDERS
      document.querySelectorAll('.section-divider').forEach((div) => {
        gsap.fromTo(div, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out', scrollTrigger: { trigger: div, start: 'top 85%' } });
      });
    }, pageRef);

    return () => {
      if (ctx) ctx.revert();
    };
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<MetaTags
  title="About"
  description="Norbert Brett (br3tt) is a full-stack engineer and AI developer who builds clean, functional, and user-centered digital products."
  openGraph={{
    title: 'About | Norbert Brett',
    description: 'Learn about Norbert Brett (br3tt), a full-stack engineer and AI developer with a background in operational leadership.'
  }}
/>

<div bind:this={pageRef} onmousemove={handleMouseMove} class="min-h-screen text-foreground overflow-x-hidden bg-background" role="main">

  <!-- HERO -->
  <section class="hero-section relative min-h-[95vh] flex flex-col justify-end pb-28 md:pb-36 overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img
        src="https://res.cloudinary.com/nbrett/image/upload/v1758661776/3170B43D-E178-4C7F-81A1-B4D0B128D021_zjinq2.jpg"
        alt="Norbert Brett"
        class="hero-bg-img w-full h-[120%] object-cover grayscale contrast-110 opacity-40 shadow-2xl" />
      <div class="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent"></div>
      <div class="absolute inset-0 bg-linear-to-r from-background/70 via-transparent to-background/50"></div>
    </div>
    
    <div class="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
      <div class="hero-eyebrow flex items-center gap-4 mb-8">
        <div class="h-px w-12 bg-accent"></div>
        <span class="text-accent font-sans text-xs font-semibold tracking-widest uppercase">Developer Profile</span>
      </div>
      
      <h1 class="text-[14vw] md:text-[10vw] lg:text-[9rem] leading-[0.95] font-serif tracking-tight mb-12 overflow-hidden py-[0.1em] px-[0.05em] -my-[0.1em] -mx-[0.05em] drop-shadow-2xl">
        {#each nameChars as char, i}
          <span
            class="hero-char inline-block will-change-transform {char === ' ' ? 'w-[0.25em]' : char === '.' ? 'text-accent' : 'text-foreground'}"
          >{char === ' ' ? '\u00A0' : char}</span>
        {/each}
        <span class="hero-char inline-block text-accent">.</span>
      </h1>

      <div class="flex flex-col lg:flex-row lg:items-end gap-12 lg:gap-20">
        <div class="hero-bio lg:max-w-md">
          <div class="border-l-2 border-accent/40 pl-6">
            <p class="text-lg md:text-xl text-foreground/90 font-light leading-relaxed mb-4">
              Full-stack engineer with <strong class="text-foreground font-semibold">11+ years</strong> of operational leadership.
            </p>
            <div class="flex items-center gap-3">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
              </span>
              <span class="text-xs font-sans font-medium text-accent tracking-[0.15em] uppercase">Available for work</span>
            </div>
          </div>
        </div>
        
        <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each stats as stat, i (i)}
            <div class="hero-stat group p-5 md:p-6 rounded-2xl border border-border/40 bg-foreground/[0.02] hover:bg-foreground/[0.05] hover:border-accent/25 transition-all duration-500">
              <span class="text-[10px] font-sans font-bold text-foreground/45 tracking-[0.15em] uppercase block mb-3">{stat.code}</span>
              <span class="text-3xl md:text-4xl font-sans font-bold text-foreground group-hover:text-accent transition-colors duration-300 block leading-none">{stat.number}</span>
              <span class="text-[10px] font-sans font-bold text-foreground/45 mt-2 tracking-wide block uppercase">{stat.label}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
    
    <!-- Premium Interactive Gold Scroll Down Button Capsule -->
    <div class="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-10 pointer-events-none">
      <span class="text-[9px] font-sans font-bold tracking-[0.25em] text-accent/60 uppercase">SCROLL</span>
      <div class="w-5 h-8 rounded-full border border-accent/25 flex justify-center p-1.5 bg-background/25 backdrop-blur-xs">
        <div class="w-1 h-2 bg-accent rounded-full animate-bounce"></div>
      </div>
    </div>
  </section>

  <!-- STORY -->
  <section class="story-section py-32 md:py-40 relative">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="mb-20 md:mb-28">
        <div class="flex items-center gap-4 mb-6">
          <div class="h-px w-12 bg-accent/40"></div>
          <span class="text-xs font-sans font-medium text-accent tracking-widest uppercase">The Story</span>
        </div>
      </div>
      
      <div class="grid md:grid-cols-12 gap-16 md:gap-20 mb-24 md:mb-32">
        <div class="md:col-span-5">
          <blockquote class="story-pullquote relative">
            <div class="absolute -top-6 -left-2 text-[8rem] leading-none text-accent/10 font-serif select-none pointer-events-none">"</div>
            <p class="text-3xl md:text-4xl lg:text-5xl font-sans font-light text-foreground leading-[1.3] relative z-10">
              Systems fail without <em class="text-accent font-medium not-italic">people</em>, and code fails without <em class="text-accent font-medium not-italic">purpose</em>.
            </p>
          </blockquote>
        </div>
        
        <div class="md:col-span-7 space-y-8 text-lg text-foreground/80 font-light leading-relaxed">
          <div class="story-para space-y-4">
             <h2 class="text-xl md:text-2xl font-sans font-bold text-accent mb-2">Who is Norbert Brettschneider?</h2>
             <p>Norbert Brettschneider, also known online as <strong>br3tt</strong>, is a <strong class="text-foreground font-semibold">Full-Stack Developer and AI Specialist</strong>.</p>
             <p>My journey isn't typical. Before I wrote code, I spent <strong class="text-foreground font-semibold">11 years leading teams</strong> in high-pressure environments across multinational brands like McDonalds and KFC. That discipline became my foundation.</p>
             <p>I earned a <strong class="text-foreground font-semibold">First Class Honours</strong> degree in Computer Science and now build software with rigor, efficiency, and a focus on scalability.</p>
             <ul class="list-disc pl-5 mt-4 space-y-2 text-base text-foreground/70">
               <li>Specializes in bridging user-centered design with Generative AI technologies.</li>
               <li>Builds highly performant, animation-rich interfaces using SvelteKit.</li>
               <li>Architects scalable Python and Node.js backend infrastructure.</li>
             </ul>
          </div>
        </div>
      </div>
      
      <div class="section-divider w-full h-px bg-linear-to-r from-transparent via-accent/20 to-transparent origin-center mb-24 md:mb-32"></div>
      
      <div class="values-grid grid md:grid-cols-3 gap-6 md:gap-8">
        {#each values as val, i (i)}
          <div class="value-card group relative p-8 md:p-10 rounded-2xl border border-border/40 bg-foreground/[0.02] hover:border-accent/25 transition-all duration-500 hover:bg-foreground/[0.05]">
            <div class="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:border-accent transition-all duration-500 shadow-xl">
               <!-- SVG Icons for Purpose, Shield, Sparkles -->
               {#if val.icon === 'target'}
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent group-hover:text-[#181715] transition-colors"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
               {:else if val.icon === 'shield-check'}
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent group-hover:text-[#181715] transition-colors"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
               {:else if val.icon === 'sparkles'}
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent group-hover:text-[#181715] transition-colors"><path d="m12 3 1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
               {/if}
            </div>
            <h3 class="text-xl font-sans font-semibold text-foreground mb-3 group-hover:text-accent transition-colors duration-300 tracking-tight">{val.title}</h3>
            <p class="text-sm text-foreground/60 leading-relaxed font-light">{val.text}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SKILLS (Redesigned as an elite, high-end System Matrix Dashboard) -->
  <section class="skills-section py-32 md:py-40 relative overflow-hidden border-t border-b border-border/30 bg-background">
    <!-- Fine-line grid pattern in section backdrop -->
    <div class="absolute inset-0 opacity-10 pointer-events-none select-none">
      <div class="w-full h-full" style="background-image: radial-gradient(var(--accent) 0.8px, transparent 0.8px); background-size: 2rem 2rem; mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 85%); -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 85%);"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
      <div class="skills-header flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-6">
        <div>
          <div class="flex items-center gap-4 mb-6">
            <div class="h-px w-12 bg-accent/40"></div>
            <span class="text-xs font-sans font-bold text-accent/70 tracking-[0.25em] uppercase">Capabilities</span>
          </div>
          <h2 class="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight leading-[0.9]">System <span class="text-accent">Specs</span></h2>
        </div>
        <p class="text-foreground/50 text-xs font-mono tracking-widest max-w-xs md:text-right uppercase">
          [ MODULES LOADED: 5 / STACK ENGINE ACTIVE ]
        </p>
      </div>
      
      <div class="skills-grid grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {#each skillCategories as cat, i (i)}
          <!-- Large modular plaque cards with interactive spotlight coordinates -->
          <div class="skill-category-card spotlight-card group relative p-8 md:p-10 rounded-3xl border border-border/40 bg-foreground/[0.02] hover:border-accent/25 transition-all duration-500 overflow-hidden shadow-2xl {i === 4 ? 'lg:col-span-2' : ''}">
            <!-- Customized gold accent cursor spotlights -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" style="background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212,176,85,0.07), transparent 65%);"></div>
            
            <div class="relative z-10 mb-8 flex items-start justify-between">
              <div class="flex items-center gap-5">
                <!-- Rotating gold dynamic icon frame -->
                <div class="w-12 h-12 bg-background/50 flex items-center justify-center rounded-2xl border border-border/40 text-accent group-hover:bg-accent group-hover:text-[#181715] transition-all duration-500 shadow-lg group-hover:rotate-[360deg]">
                  {#if cat.icon === 'layout'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="m9 21 0-12"/></svg>
                  {:else if cat.icon === 'server'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
                  {:else if cat.icon === 'brain'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 5.886 4 4 0 0 0 6.587 4.774 4 4 0 0 0 6.587-4.774 4 4 0 0 0 .52-5.886 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5z"/></svg>
                  {:else if cat.icon === 'cloud'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a5.5 5.5 0 0 0 0-11h-1.5a7 7 0 1 0-13.5 1.5c-2.5.5-2.5 4.5 0 5h15Z"/></svg>
                  {:else if cat.icon === 'users'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  {/if}
                </div>
                <div>
                  <h3 class="text-xl font-sans font-semibold text-foreground group-hover:text-accent transition-colors duration-300 tracking-tight">{cat.name}</h3>
                  <span class="font-mono text-[9px] font-bold text-foreground/40 tracking-[0.2em] uppercase">{cat.code}</span>
                </div>
              </div>
              
              <!-- Subtle active terminal readout coordinates in corner -->
              <span class="text-[9px] font-mono text-accent/30 hidden sm:block tracking-widest">[PORT_ID: {i * 102} // CORE_ENG]</span>
            </div>
            
            <!-- Matrix micro-cards chip grid -->
            <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 {i === 4 ? 'lg:grid-cols-3' : ''} gap-3.5">
              {#each cat.skills as skill}
                <div class="group/skill relative p-4 rounded-2xl border border-border/40 bg-foreground/[0.01] hover:bg-foreground/[0.04] hover:border-accent/35 transition-all duration-300 flex flex-col justify-between min-h-[82px] shadow-sm">
                  <!-- Bouncing active coordinate beacon -->
                  <div class="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-accent opacity-20 group-hover/skill:opacity-100 group-hover/skill:scale-125 transition-all duration-500">
                    <div class="absolute inset-0 bg-accent animate-ping rounded-full opacity-0 group-hover/skill:opacity-50"></div>
                  </div>
                  
                  <p class="text-[9px] font-mono font-bold text-foreground/45 group-hover/skill:text-accent/80 transition-colors tracking-[0.1em] uppercase">
                    LVL {skill.level}%
                  </p>
                  
                  <div class="mt-2 flex flex-col gap-2">
                    <p class="text-sm font-sans font-semibold text-foreground group-hover/skill:text-foreground transition-colors tracking-tight leading-tight">
                      {skill.name}
                    </p>
                    
                    <!-- Futuristic flat gold meter line -->
                    <div class="w-full h-[2px] bg-border/25 rounded-full overflow-hidden">
                      <div class="skill-bar-fill h-full bg-accent origin-left transition-all duration-1000 shadow-[0_0_8px_rgba(212,176,85,0.45)]" data-level={skill.level} style="width: 0%"></div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- TIMELINE -->
  <section class="py-32 md:py-40 relative">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="text-center mb-20 md:mb-28">
        <div class="flex items-center justify-center gap-4 mb-6">
          <div class="h-px w-12 bg-primary/40"></div>
          <span class="text-xs font-sans font-medium text-primary tracking-widest uppercase">Career</span>
          <div class="h-px w-12 bg-primary/40"></div>
        </div>
        <h2 class="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight">Track <span class="text-primary">Record</span></h2>
      </div>
      
      <div class="relative timeline-container max-w-4xl mx-auto">
        <div class="absolute left-[calc(1.5rem-1px)] md:left-[calc(50%-1px)] top-0 bottom-0 w-[2px] bg-border"></div>
        <div class="timeline-line absolute left-[calc(1.5rem-1px)] md:left-[calc(50%-1px)] top-0 w-[2px] bg-primary/50 h-0 z-0 shadow-[0_0_15px_rgba(var(--primary),0.3)]"></div>
        
        {#each timeline as item, i (i)}
          <div class="timeline-entry relative grid md:grid-cols-2 gap-8 md:gap-20 mb-20 last:mb-0 group">
            <div class="timeline-dot absolute left-[calc(1.5rem-8px)] md:left-[calc(50%-8px)] top-2 w-4 h-4 bg-background border-2 border-foreground/40 z-10 group-hover:border-primary group-hover:scale-125 transition-all duration-500 rounded-full shadow-lg">
              {#if item.active}
                <div class="absolute inset-0 bg-primary animate-ping opacity-50 rounded-full"></div>
                <div class="absolute inset-0 bg-primary rounded-full"></div>
              {/if}
            </div>
            
            <div class={i % 2 === 0 ? 'pl-16 md:pl-0 md:text-right md:order-1 md:pr-12' : 'pl-16 md:order-2 md:text-left md:pl-12'}>
              <span class="font-sans text-5xl md:text-7xl font-bold text-foreground/10 group-hover:text-primary/30 transition-colors duration-500 leading-none block tracking-tight">{item.year}</span>
            </div>
            
            <div class={i % 2 === 0 ? 'pl-16 md:order-2 md:pl-12' : 'pl-16 md:pl-0 md:order-1 md:text-right md:pr-12'}>
              <div class="p-6 rounded-2xl border border-border/50 bg-foreground/3 group-hover:border-primary/15 group-hover:bg-foreground/5 transition-all duration-500 shadow-2xl">
                <div class="flex items-center gap-3 mb-3 {i % 2 !== 0 ? 'md:flex-row-reverse' : ''}">
                  <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    {#if item.icon === 'truck'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="16" height="13" x="2" y="4" rx="2"/><path d="M16 9h4l3 3v2h-7V9z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    {:else if item.icon === 'code'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    {:else if item.icon === 'headphones'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
                    {:else if item.icon === 'graduation-cap'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    {:else if item.icon === 'briefcase'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    {/if}
                  </div>
                  <div>
                    <h3 class="text-lg font-sans font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{item.role}</h3>
                    <span class="text-xs font-sans font-medium text-foreground/60 tracking-wide">{item.company}</span>
                  </div>
                </div>
                <p class="text-sm text-foreground/80 leading-relaxed {i % 2 !== 0 ? 'md:text-right' : ''}">{item.desc}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Foundational Quote -->
  <FoundationalQuote
    quote={"The {highlight} gave, and the {highlight} has taken away; "}
    highlightedWord="LORD"
    source="Job 1:21"
    subQuote={"blessed be the name of the {highlight}"}
  />
</div>

<style>
  .hero-char {
    text-shadow: 0 0 30px rgba(0,0,0,0.5);
  }
  
  .spotlight-card {
    will-change: transform, opacity;
    transform-style: preserve-3d;
  }
</style>
