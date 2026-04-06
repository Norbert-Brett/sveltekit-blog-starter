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
    { label: 'Years Experience', value: exp, suffix: '+' },
    { label: 'Core Projects', value: 15, suffix: '+' },
    { label: 'System Uptime', value: 100, suffix: '%' },
    { label: 'Customer Satisfaction', value: 100, suffix: '%' },
  ];

  let statsRef = $state(null);
  let displayedValues = $state(stats.map(() => 0));
  let ctx;

  const handleMouseMove = (e) => {
    const card = e.target.closest('.metric-card-wrapper');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
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
        }
      });
    });
  };

  onMount(() => {
    if (!browser || !statsRef) return;

    ctx = gsap.context(() => {
      gsap.fromTo('.metric-card-wrapper',
        { y: 60, opacity: 0, rotateX: 15, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1,
          rotateX: 0,
          scale: 1,
          stagger: 0.1, 
          duration: 1.2, 
          ease: 'expo.out',
          scrollTrigger: {
            trigger: statsRef,
            start: 'top 85%',
            toggleActions: 'play none none none',
            onEnter: startCounters
          }
        }
      );
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      
      {#each stats as stat, index (index)}
        <div 
          class="metric-card-wrapper relative group rounded-[2rem] bg-white/[0.02] overflow-hidden"
        >
          <!-- Border Glow -->
          <div 
            class="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
            style="background: radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.4), transparent 40%); mix-blend-mode: overlay;"
          ></div>
          
          <!-- Inner Background -->
          <div class="absolute inset-[1px] rounded-[calc(2rem-1px)] bg-[#0A0D0B]/80 backdrop-blur-2xl z-0"></div>
          
          <!-- Hover Shine -->
          <div 
            class="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 z-10"
            style="background: radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.03), transparent 40%);"
          ></div>

          <div class="relative z-20 flex flex-col justify-between h-full min-h-[180px] p-8 md:p-10">
            <div class="flex items-center justify-between mb-12">
              <span class="text-sm font-mono text-white/60 transition-colors group-hover:text-white/70">0{index + 1}</span>
              <div class="w-1.5 h-1.5 rounded-full bg-white/20 transition-all duration-500 group-hover:bg-white group-hover:shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            </div>
            
            <div class="mt-auto">
              <div class="flex items-baseline gap-1 mb-3">
                <span class="text-6xl lg:text-7xl font-sans font-light text-white tracking-tighter tabular-nums leading-none">
                  {displayedValues[index]}
                </span>
                <span class="text-2xl lg:text-3xl font-light text-white/60">{stat.suffix}</span>
              </div>
              
              <div class="text-xs uppercase tracking-[0.2em] text-white/70 font-medium group-hover:text-white/80 transition-colors duration-500">
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
    will-change: transform, opacity;
    transform-style: preserve-3d;
  }
</style>
