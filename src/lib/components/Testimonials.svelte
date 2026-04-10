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

  const testimonials = [
    {
      quote: "Working with Norbert was a game-changer. His leadership background shows - he understands both the technical requirements and business needs. Delivered exactly what we needed, on time.",
      author: {
        name: 'Nikolay Potapov',
        description: 'CS Student'
      }
    },
    {
      quote: "His combination of leadership experience and technical skills is rare. Norbert doesn't just code - he thinks strategically about user experience and business impact.",
      author: {
        name: 'Evelyn Dezsi',
        description: 'Equipment Controller / CS Student'
      }
    },
    {
      quote: "From concept to deployment, Norbert handled our project with professionalism. His leadership skills and technical expertise were instrumental in our success.",
      author: {
        name: 'Thomas Weber',
        description: 'Small Business Owner'
      }
    }
  ];

  onMount(() => {
    if (!browser || !sectionRef) return;

    ctx = gsap.context(() => {
      // 1. Parallax background text
      gsap.to('.testimonial-bg-text', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });

      // 2. Chat bubbles kinetics
      const bubbles = gsap.utils.toArray('.chat-bubble');
      bubbles.forEach((bubble, i) => {
        const xOffset = i % 2 === 0 ? -40 : 40;

        // Initial state
        gsap.set(bubble, { opacity: 0, y: 60, x: xOffset, scale: 0.85, filter: 'blur(8px)' });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bubble,
            start: 'top 95%',
            end: 'bottom 5%',
            scrub: 0.4
          }
        });

        tl.to(bubble, {
          opacity: 1, 
          y: 0, 
          x: 0, 
          scale: 1, 
          filter: 'blur(0px)',
          duration: 0.15,
          ease: 'power2.out'
        })
        .to(bubble, { duration: 0.7 }) // sustain much longer
        .to(bubble, {
          opacity: 0.15, 
          y: -40, 
          scale: 0.9, 
          filter: 'blur(12px)',
          duration: 0.15,
          ease: 'power2.in'
        });
      });
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => {
      if (ctx) ctx.revert();
    };
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<section bind:this={sectionRef} class="relative py-32 md:py-48 overflow-hidden bg-background flex flex-col items-center">
  <!-- Interactive Parallax Background Header -->
  <div class="absolute inset-0 flex items-center justify-center md:items-start pointer-events-none whitespace-nowrap opacity-100 select-none overflow-hidden mt-12 md:mt-0 z-0">
    <h2 class="testimonial-bg-text text-[20vw] font-serif font-black leading-none text-white/3 tracking-tighter uppercase sticky top-1/4">
      Testimonials
    </h2>
  </div>

  <!-- Section Header -->
  <div class="relative z-10 w-full max-w-7xl px-6 mb-24 md:mb-32 text-center md:text-left">
    <span class="text-[11px] font-mono tracking-[0.3em] uppercase text-primary mb-4 block md:inline-block">
      --- KIND WORDS
    </span>
    <h2 class="text-4xl md:text-7xl font-serif font-black tracking-tighter text-white leading-[0.9]">
      What people say<br class="hidden md:block"/> about me
    </h2>
  </div>

  <!-- Kinetic Floating Bubbles Container -->
  <div class="relative z-10 w-full max-w-5xl px-6 flex flex-col gap-16 md:gap-32">
    {#each testimonials as item, index}
      <div 
        class="chat-bubble relative w-full md:max-w-[600px] rounded-[2.5rem] bg-[#0A0D0B]/60 hover:bg-[#0A0D0B]/80 backdrop-blur-2xl border border-white/10 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group transition-all duration-700
          {index % 2 === 0 ? 'self-start md:ml-12' : 'self-end md:mr-12'}
          {index === 0 ? 'md:max-w-[620px]' : ''}
          {index === 1 ? 'md:max-w-[480px]' : ''}
          {index === 2 ? 'md:max-w-[720px]' : ''}"
      >
        <!-- Gold Inner Atmosphere -->
        <div class="absolute inset-0 rounded-[2.5rem] bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

        <div class="relative z-10 flex flex-col gap-8">
          <!-- Stylized Quotation Anchor -->
          <span class="text-6xl md:text-8xl font-serif leading-none text-primary/10 select-none -mb-8 -ml-4" aria-hidden="true">“</span>

          <!-- Testimonial Content -->
          <p class="text-lg md:text-xl lg:text-2xl font-serif text-white/90 leading-relaxed italic pr-4">
            { item.quote }
          </p>
          
          <!-- Author Identity -->
          <div class="flex items-center gap-5 mt-4 pt-8 border-t border-white/5">
            <div class="flex flex-col">
              <h4 class="text-sm md:text-base font-bold uppercase tracking-widest text-white underline underline-offset-8 decoration-primary/30">{ item.author.name }</h4>
              <p class="mt-2 text-[10px] md:text-xs font-mono text-primary font-semibold uppercase tracking-[0.2em]">{ item.author.description }</p>
            </div>
          </div>
        </div>

        <!-- Dynamic Architectural Bubble "Tail" -->
        <div 
          class="absolute bottom-[-15px] w-10 h-10 bg-[#0A0D0B]/60 backdrop-blur-md border-b border-r border-white/10 transform rotate-45 pointer-events-none {index % 2 === 0 ? 'left-16' : 'right-16'}"
        ></div>
      </div>
    {/each}
  </div>
</section>

<style>
  .chat-bubble {
    will-change: transform, opacity, filter;
  }
</style>
