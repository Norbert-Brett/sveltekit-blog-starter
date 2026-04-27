<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let { text = 'Design · Develop · Deploy ·', repeat = 8 } = $props();
  
  let marqueeRef = $state(null);
  let ctx;
  let baseVelocity = 50; // px/s base speed

  onMount(() => {
    if (!browser || !marqueeRef) return;

    const track = marqueeRef.querySelector('.marquee-track');
    if (!track) return;

    // Calculate total width of one set of text
    const items = track.querySelectorAll('.marquee-item');
    if (items.length === 0) return;
    
    // Clone for seamless loop
    const firstHalf = Array.from(items);
    firstHalf.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });

    const totalWidth = track.scrollWidth / 2;

    // GSAP infinite horizontal scroll
    let xPercent = 0;
    let direction = -1;

    const xTo = gsap.quickTo(track, 'x', { duration: 0.5, ease: 'none' });

    ctx = gsap.context(() => {
      // Scroll velocity modulation
      ScrollTrigger.create({
        trigger: marqueeRef,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          // Velocity adds to base speed — faster scroll = faster marquee
          const clampedVelocity = gsap.utils.clamp(-2000, 2000, velocity);
          direction = clampedVelocity < 0 ? -1 : clampedVelocity > 0 ? 1 : direction;
        }
      });

      // Continuous animation loop
      const animate = () => {
        xPercent -= direction * (baseVelocity / 60);
        
        // Reset seamlessly when one full width has passed
        if (Math.abs(xPercent) >= totalWidth) {
          xPercent = 0;
        }
        
        xTo(xPercent);
        requestAnimationFrame(animate);
      };
      
      animate();

      // Fade in on scroll
      gsap.fromTo(marqueeRef,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 1, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: marqueeRef,
            start: 'top 90%',
          }
        }
      );
    }, marqueeRef);

    return () => {
      if (ctx) ctx.revert();
    };
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<div
  bind:this={marqueeRef}
  class="relative py-12 md:py-16 overflow-hidden select-none pointer-events-none opacity-0"
>
  <!-- Top/bottom border lines -->
  <div class="absolute top-0 left-0 right-0 h-px bg-white/5"></div>
  <div class="absolute bottom-0 left-0 right-0 h-px bg-white/5"></div>

  <div class="marquee-track flex whitespace-nowrap will-change-transform">
    {#each Array(repeat) as _, i (i)}
      <span class="marquee-item text-[6vw] md:text-[4vw] lg:text-[3vw] font-sans font-bold text-white/4 tracking-tight px-8 uppercase shrink-0">
        {text}
      </span>
    {/each}
  </div>
</div>
