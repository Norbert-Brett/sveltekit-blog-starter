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
        description: 'CS Student / Controller'
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

  // Handle dial rotation and active index changes (manually or automatically)
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
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
      <div>
        <span class="text-xs font-mono tracking-[0.4em] text-accent mb-2 block uppercase">// SYSTEM DATA // FEEDBACK</span>
        <h2 class="text-4xl md:text-5xl font-sans font-black tracking-tight text-white uppercase">
          CLIENT <span class="text-transparent bg-clip-text bg-linear-to-r from-accent to-white/70">FEEDBACK.</span>
        </h2>
      </div>
      <div class="text-xs font-mono text-white/40 tracking-[0.2em] uppercase hidden md:block">
        ACTIVE NODES: 03 // AUTOPLAY: ACTIVE
      </div>
    </div>

    <!-- Sleek Two-Column Bento Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-stretch">
      
      <!-- LEFT COLUMN: The elegant featured quote card (Spans 2 columns on desktop) -->
      <div 
        class="bento-panel lg:col-span-2 p-8 md:p-12 rounded-3xl bg-[#141311]/50 backdrop-blur-md border border-white/10 relative flex flex-col justify-between overflow-hidden min-h-[380px] group transition-colors duration-500 hover:border-accent/30 hover:bg-[#1E1C19]/60"
        onmousemove={handleMouseMove}
        role="presentation"
      >
        <!-- Radial Spotlight Glow -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
             style="background: radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(201,168,76,0.06), transparent 75%);">
        </div>

        <div class="absolute top-4 right-4 text-[9px] font-mono tracking-widest text-white/30 uppercase select-none">// STABLE_FEED</div>

        <span class="text-6xl md:text-8xl font-serif text-accent/15 select-none pointer-events-none leading-none z-10">“</span>

        <div class="z-10 -mt-4">
          <p class="telemetry-fade-target text-xl md:text-2xl lg:text-3xl font-sans font-medium text-white/95 leading-relaxed tracking-wide">
            "{testimonials[activeIndex].quote}"
          </p>
        </div>

        <!-- Quote Author Footer -->
        <div class="flex items-center gap-4 pt-8 border-t border-white/5 mt-8 z-10">
          <div class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <span class="text-accent font-black text-lg font-mono">{testimonials[activeIndex].author.name.charAt(0)}</span>
          </div>
          <div>
            <h4 class="telemetry-fade-target text-base font-sans font-bold text-white tracking-wide">{testimonials[activeIndex].author.name}</h4>
            <p class="telemetry-fade-target text-xs font-mono text-white/40 uppercase mt-0.5">{testimonials[activeIndex].author.description}</p>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Elegant Rotating Selector Dial -->
      <div 
        class="bento-panel p-8 rounded-3xl bg-[#141311]/50 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center relative overflow-hidden min-h-[380px] group transition-all duration-500 hover:border-accent/30 hover:bg-[#1E1C19]/60"
        onmousemove={handleMouseMove}
        role="presentation"
      >
        <!-- Radial Spotlight Glow -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
             style="background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(201,168,76,0.06), transparent 75%);">
        </div>

        <div class="absolute top-4 left-4 text-[9px] font-mono tracking-widest text-white/30 uppercase select-none">// DIAL_CONTROL</div>

        <!-- The Selection Wheel -->
        <div class="relative w-56 h-56 flex items-center justify-center z-10">
          <!-- Background Orbit Rings with pointer-events-none to prevent blocking clicks -->
          <div class="absolute w-44 h-44 rounded-full border border-white/5 animate-pulse pointer-events-none"></div>
          <div class="absolute w-32 h-32 rounded-full border border-accent/10 border-dashed pointer-events-none"></div>

          <!-- Interactive SVG -->
          <svg class="w-full h-full relative z-20 pointer-events-auto" viewBox="0 0 200 200">
            <!-- Central core group that rotates -->
            <g bind:this={dialRef} class="origin-center">
              <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" />
              
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
                  <!-- Broad interactive target zone -->
                  <circle cx={cx} cy={cy} r="18" fill="transparent" />
                  
                  <!-- Glowing selector node -->
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={activeIndex === idx ? "8" : "5"} 
                    fill={activeIndex === idx ? "var(--color-accent)" : "rgba(255,255,255,0.25)"} 
                    class="transition-all duration-500 group-hover/node:fill-accent"
                    filter={activeIndex === idx ? "drop-shadow(0 0 4px var(--color-accent))" : ""}
                  />
                  {#if activeIndex === idx}
                    <circle cx={cx} cy={cy} r="3" fill="#141311" />
                  {/if}
                </g>
              {/each}
            </g>

            <path d="M 100 10 L 100 20 M 100 180 L 100 190" stroke="rgba(201,168,76,0.3)" stroke-width="1.5" />
          </svg>

          <!-- Dial Core Label -->
          <div class="absolute w-20 h-20 rounded-full bg-[#141311] border border-white/10 flex flex-col items-center justify-center pointer-events-none shadow-2xl z-10">
            <span class="text-xs font-mono font-bold text-accent">NODE</span>
            <span class="text-xl font-mono font-black text-white">0{activeIndex + 1}</span>
          </div>
        </div>

        <div class="mt-6 text-[10px] font-mono tracking-widest text-white/40 uppercase z-10 text-center">// CLICK NODE OR WAIT FOR ROTATION</div>
      </div>

    </div>
  </div>
</section>
