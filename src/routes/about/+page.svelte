<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { siteTitle } from '$lib/config';
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
    { icon: 'sparkles', title: 'Craft-Obsessed', text: 'I obsess over the details — from pixel-perfect UI to optimised database queries.' }
  ];

  const skillCategories = [
    {
      name: 'Frontend Systems',
      code: 'FE_SYS',
      icon: 'layout',
      skills: [
        { name: 'Svelte/SvelteKit', level: 95 },
        { name: 'Vue/Nuxt', level: 90 },
        { name: 'React', level: 75 },
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
        { name: 'FastAPI', level: 85 },
        { name: 'Node.js', level: 82 },
        { name: 'PostgreSQL', level: 88 },
        { name: 'Redis', level: 75 }
      ]
    },
    {
      name: 'DevOps & Cloud',
      code: 'OPS_CLD',
      icon: 'cloud',
      skills: [
        { name: 'AWS', level: 80 },
        { name: 'Docker', level: 88 },
        { name: 'CI/CD', level: 85 },
        { name: 'Linux', level: 82 },
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
  description="Norbert Brettschneider (br3tt) is a full-stack developer and AI specialist specializing in user-centered digital experiences."
  openGraph={{
    title: 'About | Norbert Brettschneider',
    description: 'Learn about Norbert Brettschneider (br3tt), a Full-Stack Developer and AI Specialist with a foundation in operational leadership.'
  }}
/>

<div bind:this={pageRef} onmousemove={handleMouseMove} class="min-h-screen text-white overflow-x-hidden bg-background" role="main">

  <!-- HERO -->
  <section class="hero-section relative min-h-[90vh] flex flex-col justify-end pb-16 overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img
        src="https://res.cloudinary.com/nbrett/image/upload/v1758661776/3170B43D-E178-4C7F-81A1-B4D0B128D021_zjinq2.jpg"
        alt="Norbert Brett"
        class="hero-bg-img w-full h-[120%] object-cover grayscale contrast-110 opacity-40 shadow-2xl" />
      <div class="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent"></div>
      <div class="absolute inset-0 bg-linear-to-r from-background/70 via-transparent to-background/50"></div>
    </div>
    
    <div class="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] bg-primary/4 rounded-full blur-[150px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
      <div class="hero-eyebrow flex items-center gap-4 mb-8">
        <div class="h-px w-12 bg-primary"></div>
        <span class="text-primary font-mono text-[10px] tracking-[0.5em] uppercase opacity-90">Developer Profile</span>
      </div>
      
      <h1 class="text-[14vw] md:text-[10vw] lg:text-[9rem] leading-[0.85] font-serif font-black tracking-tighter mb-12 overflow-hidden drop-shadow-2xl">
        {#each nameChars as char, i}
          <span
            class="hero-char inline-block will-change-transform {char === ' ' ? 'w-[0.25em]' : char === '.' ? 'text-primary' : 'text-white'}"
          >{char === ' ' ? '\u00A0' : char}</span>
        {/each}
        <span class="hero-char inline-block text-primary">.</span>
      </h1>

      <div class="flex flex-col lg:flex-row lg:items-end gap-12 lg:gap-20">
        <div class="hero-bio lg:max-w-md">
          <div class="border-l-2 border-primary/50 pl-6">
            <p class="text-lg md:text-xl text-white/90 font-light leading-relaxed mb-4">
              Full-stack engineer with <strong class="text-white font-semibold">11+ years</strong> of operational leadership.
            </p>
            <div class="flex items-center gap-3">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span class="text-xs font-mono text-primary tracking-widest uppercase">Available for work</span>
            </div>
          </div>
        </div>
        
        <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each stats as stat, i (i)}
            <div class="hero-stat group p-5 md:p-6 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-primary/20 transition-all duration-500">
              <span class="text-[9px] font-mono text-white/70 uppercase tracking-wider block mb-3">{stat.code}</span>
              <span class="text-3xl md:text-4xl font-serif font-black text-white group-hover:text-primary transition-colors duration-300 block leading-none">{stat.number}</span>
              <span class="text-[10px] font-mono text-white/70 mt-2 uppercase tracking-wider block">{stat.label}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
    
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
      <span class="text-[9px] font-mono tracking-[0.4em] uppercase text-white/50">Scroll</span>
      <div class="w-px h-8 bg-linear-to-b from-white/50 to-transparent animate-pulse"></div>
    </div>
  </section>

  <!-- STORY -->
  <section class="story-section py-32 md:py-40 relative">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="mb-20 md:mb-28">
        <div class="flex items-center gap-4 mb-6">
          <div class="h-px w-12 bg-primary/40"></div>
          <span class="text-[10px] font-mono text-primary font-medium tracking-[0.5em] uppercase">The Story</span>
        </div>
      </div>
      
      <div class="grid md:grid-cols-12 gap-16 md:gap-20 mb-24 md:mb-32">
        <div class="md:col-span-5">
          <blockquote class="story-pullquote relative">
            <div class="absolute -top-6 -left-2 text-[8rem] leading-none text-primary/10 font-serif select-none pointer-events-none">"</div>
            <p class="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white leading-[1.3] relative z-10 italic">
              Systems fail without <em class="text-primary font-medium not-italic">people</em>, and code fails without <em class="text-primary font-medium not-italic">purpose</em>.
            </p>
          </blockquote>
        </div>
        
        <div class="md:col-span-7 space-y-8 text-lg text-white/80 font-light leading-relaxed">
          <div class="story-para space-y-4">
             <h2 class="text-xl md:text-2xl font-serif font-bold text-primary mb-2">Who is Norbert Brettschneider?</h2>
             <p>Norbert Brettschneider, also known online as <strong>br3tt</strong>, is a <strong class="text-white font-semibold">Full-Stack Developer and AI Specialist</strong>.</p>
             <p>My journey isn't typical. Before I wrote code, I spent <strong class="text-white font-semibold">11 years leading teams</strong> in high-pressure environments across multinational brands like McDonalds and KFC. That discipline became my foundation.</p>
             <p>I earned a <strong class="text-white font-semibold">First Class Honours</strong> degree in Computer Science and now build software with rigor, efficiency, and a focus on scalability.</p>
             <ul class="list-disc pl-5 mt-4 space-y-2 text-base text-white/70">
               <li>Specializes in bridging user-centered design with Generative AI technologies.</li>
               <li>Builds highly performant, animation-rich interfaces using SvelteKit.</li>
               <li>Architects scalable Python and Node.js backend infrastructure.</li>
             </ul>
          </div>
        </div>
      </div>
      
      <div class="section-divider w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent origin-center mb-24 md:mb-32"></div>
      
      <div class="values-grid grid md:grid-cols-3 gap-6 md:gap-8">
        {#each values as val, i (i)}
          <div class="value-card group relative p-8 md:p-10 rounded-2xl border border-white/5 bg-white/1.5 hover:border-primary/20 transition-all duration-500 hover:bg-white/3">
            <div class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-xl">
               <!-- SVG Icons for Purpose, Shield, Sparkles -->
               {#if val.icon === 'target'}
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary group-hover:text-black transition-colors"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
               {:else if val.icon === 'shield-check'}
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary group-hover:text-black transition-colors"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
               {:else if val.icon === 'sparkles'}
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary group-hover:text-black transition-colors"><path d="m12 3 1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
               {/if}
            </div>
            <h3 class="text-xl font-serif font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300 uppercase tracking-tight">{val.title}</h3>
            <p class="text-sm text-white/60 leading-relaxed font-light">{val.text}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SKILLS -->
  <section class="skills-section py-32 md:py-40 relative bg-black/20">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="skills-header flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-6">
        <div>
          <div class="flex items-center gap-4 mb-6">
            <div class="h-px w-12 bg-primary/40"></div>
            <span class="text-[10px] font-mono text-primary/70 tracking-[0.5em] uppercase">Capabilities</span>
          </div>
          <h2 class="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter leading-[0.9] uppercase underline decoration-primary/20 underline-offset-8">System <span class="text-primary">Specs</span></h2>
        </div>
      </div>
      
      <div class="skills-grid grid md:grid-cols-2 gap-6 md:gap-8">
        {#each skillCategories as cat, i (i)}
          <div class="skill-category-card spotlight-card group relative p-8 md:p-10 rounded-2xl border border-white/5 bg-white/2 hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-2xl">
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" style="background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(201,168,76,0.06), transparent 60%);"></div>
            <div class="relative z-10 mb-8 flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-white/3 flex items-center justify-center rounded-xl border border-white/10 text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300">
                  {#if cat.icon === 'layout'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="m9 21 0-12"/></svg>
                  {:else if cat.icon === 'server'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
                  {:else if cat.icon === 'cloud'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a5.5 5.5 0 0 0 0-11h-1.5a7 7 0 1 0-13.5 1.5c-2.5.5-2.5 4.5 0 5h15Z"/></svg>
                  {:else if cat.icon === 'users'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  {/if}
                </div>
                <div>
                  <h3 class="text-xl font-serif font-bold text-white group-hover:text-primary transition-colors tracking-tight">{cat.name}</h3>
                  <span class="font-mono text-[9px] text-white/50 tracking-wider uppercase">{cat.code}</span>
                </div>
              </div>
            </div>
            
            <div class="relative z-10 space-y-5">
              {#each cat.skills as skill}
                <div class="group/skill">
                  <div class="flex justify-between mb-2">
                    <span class="text-xs font-mono text-white/80 group-hover/skill:text-white transition-colors">{skill.name}</span>
                    <span class="text-[10px] font-mono text-white/70">{skill.level}%</span>
                  </div>
                  <div class="h-1 rounded-full bg-white/5 overflow-hidden">
                    <div class="skill-bar-fill h-full rounded-full bg-linear-to-r from-primary/60 to-primary transition-all shadow-[0_0_10px_rgba(var(--primary),0.2)]" data-level={skill.level} style="width: 0%"></div>
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
          <span class="text-[10px] font-mono text-primary font-medium tracking-[0.5em] uppercase">Career</span>
          <div class="h-px w-12 bg-primary/40"></div>
        </div>
        <h2 class="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter uppercase italic">Track <span class="text-primary not-italic">Record</span></h2>
      </div>
      
      <div class="relative timeline-container max-w-4xl mx-auto">
        <div class="absolute left-[calc(1.5rem-1px)] md:left-[calc(50%-1px)] top-0 bottom-0 w-[2px] bg-white/5"></div>
        <div class="timeline-line absolute left-[calc(1.5rem-1px)] md:left-[calc(50%-1px)] top-0 w-[2px] bg-primary/50 h-0 z-0 shadow-[0_0_15px_rgba(var(--primary),0.3)]"></div>
        
        {#each timeline as item, i (i)}
          <div class="timeline-entry relative grid md:grid-cols-2 gap-8 md:gap-20 mb-20 last:mb-0 group">
            <div class="timeline-dot absolute left-[calc(1.5rem-8px)] md:left-[calc(50%-8px)] top-2 w-4 h-4 bg-background border-2 border-white/40 z-10 group-hover:border-primary group-hover:scale-125 transition-all duration-500 rounded-full shadow-lg">
              {#if item.active}
                <div class="absolute inset-0 bg-primary animate-ping opacity-50 rounded-full"></div>
                <div class="absolute inset-0 bg-primary rounded-full"></div>
              {/if}
            </div>
            
            <div class={i % 2 === 0 ? 'pl-16 md:pl-0 md:text-right md:order-1 md:pr-12' : 'pl-16 md:order-2 md:text-left md:pl-12'}>
              <span class="font-mono text-5xl md:text-7xl font-black text-white/10 group-hover:text-primary/30 transition-colors duration-500 leading-none block">{item.year}</span>
            </div>
            
            <div class={i % 2 === 0 ? 'pl-16 md:order-2 md:pl-12' : 'pl-16 md:pl-0 md:order-1 md:text-right md:pr-12'}>
              <div class="p-6 rounded-2xl border border-white/5 bg-white/1.5 group-hover:border-primary/15 group-hover:bg-white/3 transition-all duration-500 shadow-2xl">
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
                    <h3 class="text-lg font-serif font-bold text-white group-hover:text-primary transition-colors leading-tight">{item.role}</h3>
                    <span class="text-[10px] font-mono text-white/80 uppercase tracking-wider">{item.company}</span>
                  </div>
                </div>
                <p class="text-sm text-white/80 leading-relaxed {i % 2 !== 0 ? 'md:text-right' : ''}">{item.desc}</p>
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
