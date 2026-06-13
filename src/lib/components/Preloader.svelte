<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { SplitText } from 'gsap/SplitText';

  let { onComplete } = $props();

  let container = $state(null);
  let counterElement;
  let nameEl;
  let percentage = $state(0);

  onMount(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';
    gsap.registerPlugin(SplitText);

    const nameSplit = new SplitText(nameEl, { type: 'chars', charsClass: 'inline-block overflow-hidden' });
    gsap.set(nameSplit.chars, { yPercent: 120 });

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        if (onComplete) onComplete();
      }
    });

    // Animate the counter from 0 to 100
    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 2.0,
        ease: 'expo.inOut',
        onUpdate: function () {
          percentage = Math.round(this.targets()[0].val);
        }
      }, 0
    );

    // Animate the name stagger
    tl.to(nameSplit.chars, {
      yPercent: 0,
      duration: 1.0,
      stagger: 0.04,
      ease: 'power3.out'
    }, 0.5);

    // Animate the preloader mask splitting open or fading up
    tl.to(
      container,
      {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut',
        delay: 0.2
      },
      '+=0.1'
    );
  });
</script>

<div
  bind:this={container}
  class="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-background text-foreground"
>
  <div class="relative z-10 flex flex-col items-center">
    <h1 class="text-6xl md:text-8xl font-sans font-light tracking-tighter text-foreground mb-4">
      <span bind:this={counterElement}>{percentage}</span><span class="text-foreground/50">%</span>
    </h1>
    
    <div class="mt-4 mb-8 overflow-hidden h-6">
      <h2 bind:this={nameEl} class="text-xl md:text-2xl font-serif tracking-widest text-primary">
        Norbert Brettschneider
      </h2>
    </div>

    <div class="h-px w-48 overflow-hidden bg-foreground/10">
      <div 
        class="h-full bg-accent transition-all duration-100 ease-out" 
        style="width: {percentage}%"
      ></div>
    </div>
  </div>
</div>
