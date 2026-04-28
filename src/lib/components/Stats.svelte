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
            countersFinished[index] = true;
          }
      });
    });
  };

  onMount(() => {
    if (!browser || !statsRef) return;

    ctx = gsap.context(() => {
      // The Shrapnel: High-velocity spring entrance
      const cards = gsap.utils.toArray('.metric-card-wrapper');
      gsap.fromTo(cards,
        { y: 150, scale: 0.8, opacity: 0, rotationZ: () => Math.random() * 6 - 3, filter: 'blur(10px)' },
        { 
          y: 0, 
          scale: 1, 
          opacity: 1, 
          rotationZ: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: statsRef,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
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
  <!-- Unified Architectural Dot Grid (Subtle Edge-to-Edge) -->
  <div class="absolute inset-0 z-0 pointer-events-none opacity-[0.05]">
    <div class="w-full h-full" 
         style="background-image: radial-gradient(var(--color-primary) 1px, transparent 1px); background-size: 2rem 2rem;">
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-6 relative z-10">
    <!-- Miller's Law: exactly 4 stats — within 7±2 sweet spot -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      
      {#each stats as stat, index (index)}
        <div 
          class="metric-card-wrapper relative group rounded-xl bg-[#0A0D0B] border border-white/10 transition-all duration-500 hover:shadow-[15px_15px_0px_rgba(201,168,76,0.1)] hover:-translate-y-1 hover:-translate-x-1"
          onmouseleave={handleMouseLeave}
          role="presentation"
        >
          <!-- Subtle Inner Atmosphere -->
          <div class="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>



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
