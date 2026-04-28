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
      // 1. Parallax background text + scroll-velocity skew
      const bgText = sectionRef.querySelector('.testimonial-bg-text');
      const skewTo = gsap.quickTo(bgText, 'skewY', { duration: 0.8, ease: 'power3.out' });
      
      gsap.to('.testimonial-bg-text', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
          onUpdate: (self) => {
            // Skew based on scroll velocity — creates momentum feel
            const velocity = self.getVelocity();
            const skew = gsap.utils.clamp(-4, 4, velocity / 500);
            skewTo(skew);
          }
        }
      });

      // 2. Section header entrance
      gsap.fromTo('.testimonial-header',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef, start: 'top 80%' }
        }
      );

      // 3. Split-Screen Scrolling Animation
      gsap.utils.toArray('.testimonial-card').forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0.1, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              end: 'top 25%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      });

      // 4. Robust GSAP Pinning for Left Header
      ScrollTrigger.create({
        trigger: '.testimonial-sticky-header',
        start: 'top 25%',
        endTrigger: sectionRef,
        end: 'bottom 80%',
        pin: true,
        pinSpacing: false
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

<!-- Miller's Law: 3 testimonials — within 7±2 sweet spot. Don't add more. -->
<section bind:this={sectionRef} class="relative py-32 md:py-48 overflow-clip bg-background flex flex-col items-center">
  <!-- Unified Architectural Dot Grid (Rotated) -->
  <div class="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-10 rotate-20 scale-150">
    <div class="w-full h-full" 
         style="background-image: radial-gradient(var(--color-primary) 1.5px, transparent 1.5px); background-size: 4rem 4rem; mask-image: radial-gradient(ellipse at center, black 10%, transparent 60%); -webkit-mask-image: radial-gradient(ellipse at center, black 10%, transparent 60%);">
    </div>
  </div>

  <!-- Interactive Parallax Background Header -->
  <div class="absolute inset-0 flex items-center justify-center md:items-start pointer-events-none whitespace-nowrap opacity-100 select-none overflow-hidden mt-12 md:mt-0 z-0">
    <h2 class="testimonial-bg-text text-[20vw] font-sans font-black leading-none text-white/3 tracking-tighter uppercase sticky top-1/4">
      Testimonials
    </h2>
  </div>

  <div class="relative w-full max-w-7xl px-6 flex flex-col md:flex-row gap-20 md:gap-32 z-10">
    <!-- Left: Sticky Header -->
    <div class="w-full md:w-5/12">
      <div class="testimonial-sticky-header pt-12 md:pt-0">
        <span class="text-xs font-sans font-semibold tracking-widest uppercase text-primary mb-4 block">
          --- KIND WORDS
        </span>
        <h2 class="text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-white leading-[1.05]">
          What people say<br class="hidden md:block"/> about me.
        </h2>
        <!-- Massive Decorative Quote Mark -->
        <span class="absolute -top-4 -left-12 md:-top-16 md:-left-12 text-[15rem] md:text-[20rem] font-serif leading-none text-white/2 pointer-events-none select-none z-[-1]">“</span>
      </div>
    </div>

    <!-- Right: Scrolling Quotes List -->
    <div class="w-full md:w-7/12 flex flex-col gap-32 md:gap-48 pb-32">
      {#each testimonials as item, index}
        <div class="testimonial-card relative flex flex-col gap-8 opacity-20 will-change-transform">
          <!-- Quote Text: Editorial Serif -->
          <p class="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-white/90 leading-[1.4] tracking-wide">
            "{ item.quote }"
          </p>

          <!-- Author Identity -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-white/3 flex items-center justify-center border border-white/10 shrink-0">
              <span class="text-primary font-bold text-lg font-serif">{item.author.name.charAt(0)}</span>
            </div>
            <div class="flex flex-col">
              <h4 class="text-base md:text-lg font-sans font-bold text-white tracking-wide">{ item.author.name }</h4>
              <p class="text-[10px] md:text-xs font-sans tracking-widest text-primary font-semibold uppercase mt-1">{ item.author.description }</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .testimonial-card {
    will-change: transform, opacity;
  }
</style>
