<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const currentYear = new Date().getFullYear();
  const exp = currentYear - 2021;

  const stats = [
    { label: 'Years Experience', value: exp, suffix: '+', featured: true },
    { label: 'Core Projects', value: 15, suffix: '+', featured: false },
    { label: 'System Uptime', value: 100, suffix: '%', featured: false },
    { label: 'Customer Satisfaction', value: 100, suffix: '%', featured: false },
  ];

  let statsRef = $state(null);
  let displayedValues = $state(stats.map(() => 0));
  let countersFinished = $state(stats.map(() => false));
  let ctx;

  const handleMouseMove = (e) => {
    const card = e.target.closest('.metric-card-wrapper');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // 3D tilt effect (Proximity Law: physical depth creates visual grouping)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.target.closest('.metric-card-wrapper');
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
  };

  const startCounters = () => {
    stats.forEach((stat, index) => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: stat.value,
        duration: 2.5,
        delay: index * 0.15,
        ease: "power2.out",
        onUpdate: () => {
          displayedValues[index] = Math.floor(obj.val);
        },
        onComplete: () => {
          // Glow burst on completion (Von Restorff: isolation effect on finished counters)
          countersFinished[index] = true;
          const numEl = statsRef?.querySelector(`.stat-num-${index}`);
          if (numEl) {
            gsap.fromTo(numEl, 
              { scale: 1, textShadow: '0 0 0px rgba(41,151,255,0)' },
              { scale: 1.1, textShadow: '0 0 25px rgba(41,151,255,0.5)', duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 }
            );
          }
        }
      });
    });
  };

  onMount(() => {
    if (!browser || !statsRef) return;

    ctx = gsap.context(() => {
      // Scroll-scrubbed scale+blur reveal (cinematic depth)
      const cards = gsap.utils.toArray('.metric-card-wrapper');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { scale: 0.8, opacity: 0, filter: 'blur(12px)', y: 60 },
          { 
            scale: 1,
            y: 0, 
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: statsRef,
              start: `top ${85 - i * 3}%`,
              end: `top ${55 - i * 3}%`,
              scrub: 0.5,
              onEnter: i === 0 ? startCounters : undefined
            }
          }
        );
      });
    }, statsRef);

    return () => {
      if (ctx) ctx.revert();
    };
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<section 
  bind:this={statsRef} 
  onmousemove={handleMouseMove}
  role="presentation"
  class="relative z-30 py-32 bg-transparent overflow-hidden"
>
  <div class="max-w-7xl mx-auto px-6 relative z-10">
    <!-- Miller's Law: exactly 4 stats — within 7±2 sweet spot -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      
      {#each stats as stat, index (index)}
        <div 
          class="metric-card-wrapper relative group rounded-4xl bg-white/2 overflow-hidden {stat.featured ? 'ring-1 ring-primary/20' : ''}"
          onmouseleave={handleMouseLeave}
        >
          <!-- Border Glow -->
          <div 
            class="pointer-events-none absolute -inset-px rounded-4xl opacity-0 transition duration-300 group-hover:opacity-100"
            style="background: radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.4), transparent 40%); mix-blend-mode: overlay;"
          ></div>
          
          <!-- Inner Background -->
          <div class="absolute inset-px rounded-[calc(2rem-1px)] bg-[#0A0D0B]/80 backdrop-blur-2xl z-0"></div>
          
          <!-- Hover Shine -->
          <div 
            class="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 z-10"
            style="background: radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.03), transparent 40%);"
          ></div>

          <!-- Von Restorff: Featured stat gets accent top border -->
          {#if stat.featured}
            <div class="absolute top-0 left-[15%] right-[15%] h-[2px] bg-linear-to-r from-transparent via-primary/60 to-transparent z-20"></div>
          {/if}

          <div class="relative z-20 flex flex-col justify-between h-full min-h-[180px] p-8 md:p-10">
            <div class="flex items-center justify-between mb-12">
              <span class="text-xs font-sans font-semibold tracking-widest text-white/60 transition-colors group-hover:text-white/70">0{index + 1}</span>
              <div class="w-1.5 h-1.5 rounded-full bg-white/20 transition-all duration-500 group-hover:bg-white group-hover:shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            </div>
            
            <!-- Proximity Law: Number + suffix + label are one tight group -->
            <div class="mt-auto space-y-1">
              <div class="flex items-baseline gap-1">
                <span class="stat-num-{index} text-6xl lg:text-7xl font-sans font-light text-white tracking-tighter tabular-nums leading-none">
                  {displayedValues[index]}
                </span>
                <span class="text-2xl lg:text-3xl font-light text-white/60">{stat.suffix}</span>
              </div>
              <div class="text-xs font-sans font-semibold uppercase tracking-widest text-primary/80 group-hover:text-primary transition-colors duration-500">
                {stat.label}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .metric-card-wrapper {
    will-change: transform, opacity, clip-path;
    transform-style: preserve-3d;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
</style>
