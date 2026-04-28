<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let sectionRef = $state(null);
  let counterRef = $state(null);
  let activePanel = $state(0);

  let ctx;

  const panels = [
    {
      label: '01',
      title: 'Who I Am',
      text: 'A full-stack developer and AI specialist with 5+ years of experience turning complex ideas into elegant, production-grade software. Rooted in computer science fundamentals, driven by curiosity.'
    },
    {
      label: '02',
      title: 'What I Build',
      text: 'AI-integrated web applications, LLM pipelines, real-time dashboards, and developer tools. From fine-tuning models to shipping pixel-perfect frontends — I own the entire stack.'
    },
    {
      label: '03',
      title: 'How I Think',
      text: 'Design with empathy, engineer with precision, ship with urgency. Every line of code should serve the user. Every system should scale gracefully. Every interface should feel inevitable.'
    }
  ];

  onMount(() => {
    if (!browser || !sectionRef) return;

    ctx = gsap.context(() => {
      // 1. Pin the section and scrub through panels
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            activePanel = Math.min(Math.floor(self.progress * panels.length), panels.length - 1);
          }
        }
      });

      // 2. Animate each panel in and out
      panels.forEach((_, i) => {
        if (i > 0) {
          tl.fromTo(`.about-panel-${i}`, 
            { yPercent: 100, opacity: 0, filter: 'blur(8px)' }, 
            { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power2.inOut' }
          );
        }
        if (i < panels.length - 1) {
          tl.to(`.about-panel-${i}`, 
            { yPercent: -50, opacity: 0, filter: 'blur(4px)', duration: 0.6, ease: 'power2.inOut' }, 
            '+=0.3'
          );
        }
      });

      // 3. Counter animation (Years of Exp)
      if (counterRef) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 5,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef,
            start: 'top 60%',
            once: true
          },
          onUpdate: () => {
            counterRef.innerText = Math.floor(obj.val);
          }
        });
      }



      // 5. Panel headings — clip-path mask reveal
      panels.forEach((_, i) => {
        gsap.set(`.about-heading-${i}`, { clipPath: 'inset(0 100% 0 0)' });
      });
      // First panel heading reveals immediately
      gsap.to('.about-heading-0', { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'expo.out', delay: 0.3,
        scrollTrigger: { trigger: sectionRef, start: 'top 70%' }
      });

      // The Impact: Container catches the momentum
      gsap.fromTo('.hero-about-inner',
        { scale: 1.1, opacity: 0, filter: 'blur(20px)' },
        { 
          scale: 1, opacity: 1, filter: 'blur(0px)', 
          duration: 1.5, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef, start: 'top 80%' }
        }
      );
    }, sectionRef);

    return () => {
      if (ctx) ctx.revert();
    };
  });

  // Trigger heading reveal when panel changes
  $effect(() => {
    if (!browser || !sectionRef) return;
    const heading = sectionRef.querySelector(`.about-heading-${activePanel}`);
    if (heading) {
      gsap.to(heading, { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'expo.out' });
    }
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<section bind:this={sectionRef} class="relative w-full h-screen overflow-hidden bg-background">


  <!-- Architectural Dot Grid & Scanline Background -->
  <div class="absolute inset-0 pointer-events-none z-0">
    <!-- Premium radial dot grid -->
    <div 
      class="absolute inset-0 opacity-20"
      style="background-image: radial-gradient(var(--color-primary) 1.5px, transparent 1.5px); background-size: 3rem 3rem; mask-image: radial-gradient(ellipse at 50% 50%, black 15%, transparent 75%); -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 15%, transparent 75%);"
    ></div>
  </div>



  <div class="hero-about-inner absolute inset-0 flex items-center justify-center px-6 md:px-24 will-change-transform">
    <div class="max-w-5xl w-full relative">
      <!-- Floating years counter -->
      <div class="absolute -top-20 right-0 md:right-12 flex items-end gap-3 z-30">
        <span bind:this={counterRef} class="text-7xl md:text-9xl font-sans font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-primary via-primary/80 to-primary/40 leading-none drop-shadow-lg">0</span>
        <span class="text-[10px] md:text-xs font-sans font-semibold tracking-widest uppercase text-white/50 pb-3 md:pb-4 border-l border-white/10 pl-3">Years<br/>Exp.</span>
      </div>

      <!-- Panels stacked on top of each other -->
      <div class="relative h-[50vh] flex items-center">
        {#each panels as panel, i}
          <div
            class="about-panel-{i} absolute inset-0 flex flex-col justify-center"
            style="opacity: {i === 0 ? 1 : 0}"
          >
            <div class="flex items-center gap-4 mb-6">
              <span class="text-[10px] md:text-xs font-sans tracking-widest uppercase text-primary font-bold">{ panel.label }</span>
              <div class="w-16 h-px bg-linear-to-r from-primary/50 to-transparent"></div>
            </div>
            <!-- Heading with clip-path mask reveal -->
            <h2 class="about-heading-{i} text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-sans font-bold tracking-tight leading-[0.9] text-white mb-8 drop-shadow-2xl text-balance gpu-accelerated">
              { panel.title }
            </h2>
            <p class="text-base sm:text-lg md:text-xl font-sans font-light text-white/70 max-w-2xl leading-relaxed tracking-wide">
              { panel.text }
            </p>
          </div>
        {/each}
      </div>

      <!-- Progress dots -->
      <div class="absolute bottom-0 left-0 flex gap-3">
        {#each Array(panels.length) as _, i}
          <div
            class="w-2 h-2 rounded-full transition-all duration-500 ease-out {activePanel >= i ? 'bg-primary shadow-[0_0_8px_rgba(41,151,255,0.4)] scale-125' : 'bg-white/10 scale-100'}"
          ></div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .about-panel-[class*="about-panel-"] {
    will-change: transform, opacity, filter;
  }
</style>
