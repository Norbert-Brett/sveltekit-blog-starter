<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let sectionRef = $state(null);
  let dialRef = $state(null);
  let activeIndex = $state(0);
  let ctx;
  let autoplayInterval;

  const testimonials = [
    {
      quote: "Working with Norbert was fantastic. Because of his leadership background, he understands both technical constraints and business goals. He delivered exactly what we needed, right on time.",
      author: {
        name: 'Nikolay Potapov',
        description: 'CS Student'
      }
    },
    {
      quote: "Norbert has a rare combination of leadership experience and technical depth. He doesn't just write code; he thinks strategically about how a system affects the product and the users.",
      author: {
        name: 'Evelyn Dezsi',
        description: 'CS Student / Controller'
      }
    },
    {
      quote: "Norbert handled our project professionally from start to finish. His technical expertise and clear communication were key to our success.",
      author: {
        name: 'Thomas Weber',
        description: 'Small Business Owner'
      }
    }
  ];

  // Mouse spotlight hover tracking
  function handleMouseMove(e) {
    if (!browser || matchMedia('(pointer: coarse)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }

  // Handle dial rotation and active index changes
  function selectTestimonial(index, manual = false) {
    if (index === activeIndex) return;

    if (manual) {
      stopAutoplay();
    }

    const targetAngle = -index * 120;
    gsap.to(dialRef, {
      rotation: targetAngle,
      duration: 0.8,
      ease: 'power3.out',
      transformOrigin: '50% 50%'
    });

    gsap.fromTo('.telemetry-fade-target',
      { opacity: 1, y: 0 },
      {
        opacity: 0,
        y: -15,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          activeIndex = index;
          gsap.fromTo('.telemetry-fade-target',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 }
          );
        }
      }
    );
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % testimonials.length;
      selectTestimonial(nextIndex, false);
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  }

  onMount(() => {
    if (!browser || !sectionRef) return;

    ctx = gsap.context(() => {
      // Entrance animation for the bento panels
      gsap.fromTo('.bento-panel',
        { opacity: 0, y: 50, scale: 0.96 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 1.2, 
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);

    startAutoplay();

    return () => {
      stopAutoplay();
      if (ctx) ctx.revert();
    };
  });

  onDestroy(() => {
    stopAutoplay();
    if (ctx) ctx.revert();
  });
</script>

<section bind:this={sectionRef} class="relative py-28 md:py-36 bg-transparent overflow-clip flex flex-col items-center">
  <!-- Grid backdrop lines -->
  <div class="absolute inset-0 z-0 pointer-events-none opacity-20">
    <div class="w-full h-full" 
         style="background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px); background-size: 60px 60px;">
    </div>
  </div>

  <div class="relative w-full max-w-7xl px-6 flex flex-col gap-12 z-10">
    
    <!-- Title HUD Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
      <div>
        <span class="text-xs font-mono tracking-[0.4em] text-accent mb-2 block uppercase">// SYSTEM DATA // FEEDBACK</span>
        <h2 class="text-4xl md:text-5xl font-serif tracking-tight text-foreground uppercase">
          CLIENT <span class="text-transparent bg-clip-text bg-linear-to-r from-accent to-foreground/70">FEEDBACK.</span>
        </h2>
      </div>
      <div class="text-xs font-mono text-foreground/40 tracking-[0.2em] uppercase hidden md:block">
        ACTIVE NODES: 03 // AUTOPLAY: ACTIVE
      </div>
    </div>

    <!-- Sleek Two-Column Bento Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-stretch">
      
      <!-- LEFT COLUMN: The elegant featured quote card (Spans 2 columns on desktop) -->
      <div 
        class="bento-panel lg:col-span-2 p-8 md:p-12 rounded-3xl glass-panel relative flex flex-col justify-between overflow-hidden min-h-[380px] group transition-colors duration-500 hover:border-accent/35"
        onmousemove={handleMouseMove}
        role="presentation"
      >
        <!-- Radial Spotlight Glow -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
             style="background: radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212,176,85,0.06), transparent 75%);">
        </div>

        <div class="absolute top-4 right-4 text-[9px] font-mono tracking-widest text-foreground/30 uppercase select-none">// STABLE_FEED</div>

        <span class="text-6xl md:text-8xl font-serif text-accent/15 select-none pointer-events-none leading-none z-10 font-black">“</span>

        <div class="z-10 -mt-4">
          <p class="telemetry-fade-target text-xl md:text-2xl lg:text-3xl font-serif text-foreground/90 leading-relaxed tracking-wide">
            "{testimonials[activeIndex].quote}"
          </p>
        </div>

        <!-- Quote Author Footer -->
        <div class="flex items-center gap-4 pt-8 border-t border-border/40 mt-8 z-10">
          <div class="w-12 h-12 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center shrink-0">
            <span class="text-accent font-black text-lg font-mono">{testimonials[activeIndex].author.name.charAt(0)}</span>
          </div>
          <div>
            <h4 class="telemetry-fade-target text-base font-sans font-bold text-foreground tracking-wide">{testimonials[activeIndex].author.name}</h4>
            <p class="telemetry-fade-target text-xs font-mono text-foreground/45 uppercase mt-0.5">{testimonials[activeIndex].author.description}</p>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Elegant Rotating Selector Dial -->
      <div 
        class="bento-panel p-8 rounded-3xl glass-panel flex flex-col items-center justify-center relative overflow-hidden min-h-[380px] group transition-all duration-500 hover:border-accent/35"
        onmousemove={handleMouseMove}
        role="presentation"
      >
        <!-- Radial Spotlight Glow -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
             style="background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212,176,85,0.06), transparent 75%);">
        </div>

        <div class="absolute top-4 left-4 text-[9px] font-mono tracking-widest text-foreground/30 uppercase select-none">// DIAL_CONTROL</div>

        <!-- The Selection Wheel -->
        <div class="relative w-56 h-56 flex items-center justify-center z-10">
          <!-- Background Orbit Rings -->
          <div class="absolute w-44 h-44 rounded-full border border-foreground/5 animate-pulse pointer-events-none"></div>
          <div class="absolute w-32 h-32 rounded-full border border-accent/10 border-dashed pointer-events-none"></div>

          <!-- Interactive SVG -->
          <svg class="w-full h-full relative z-20 pointer-events-auto" viewBox="0 0 200 200">
            <!-- Central core group that rotates -->
            <g bind:this={dialRef} class="origin-center">
              <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" class="text-foreground/10" stroke-width="2" />
              
              {#each testimonials as t, idx}
                {@const angle = idx * 120 * (Math.PI / 180)}
                {@const cx = 100 + 60 * Math.sin(angle)}
                {@const cy = 100 - 60 * Math.cos(angle)}
                
                <!-- SVG nodes supporting manual clicks -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <g 
                  class="cursor-pointer group/node pointer-events-auto"
                  onclick={() => selectTestimonial(idx, true)}
                  role="button"
                  tabindex="0"
                >
                  <circle cx={cx} cy={cy} r="18" fill="transparent" />
                  
                  <!-- Glowing selector node -->
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={activeIndex === idx ? "8" : "5"} 
                    fill={activeIndex === idx ? "var(--color-accent)" : "currentColor"} 
                    class="transition-all duration-500 group-hover/node:fill-accent {activeIndex === idx ? '' : 'text-foreground/30'}"
                    filter={activeIndex === idx ? "drop-shadow(0 0 4px var(--color-accent))" : ""}
                  />
                  {#if activeIndex === idx}
                    <circle cx={cx} cy={cy} r="3" fill="var(--color-background)" />
                  {/if}
                </g>
              {/each}
            </g>

            <path d="M 100 10 L 100 20 M 100 180 L 100 190" stroke="currentColor" class="text-accent/40" stroke-width="1.5" />
          </svg>

          <!-- Dial Core Label -->
          <div class="absolute w-20 h-20 rounded-full bg-background border border-border flex flex-col items-center justify-center pointer-events-none shadow-2xl z-10">
            <span class="text-xs font-mono font-bold text-accent">NODE</span>
            <span class="text-xl font-mono font-black text-foreground">0{activeIndex + 1}</span>
          </div>
        </div>

        <div class="mt-6 text-[10px] font-mono tracking-widest text-foreground/40 uppercase z-10 text-center">// CLICK NODE OR WAIT FOR ROTATION</div>
      </div>

    </div>
  </div>
</section>

<style>
  .font-serif {
    font-family: 'Prata', serif;
  }
</style>
