<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ArrowLeft } from '@lucide/svelte';

  onMount(() => {
    gsap.fromTo('.error-text', 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.2 }
    );
  });
</script>

<svelte:head>
  <title>Error {$page.status} | Norbert Br3tt</title>
</svelte:head>

<div class="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
  <!-- Minimalist Background Grid -->
  <div class="absolute inset-0 pointer-events-none opacity-[0.05]">
    <div class="w-full h-full" style="background-image: radial-gradient(var(--color-primary) 1px, transparent 1px); background-size: 3rem 3rem;"></div>
  </div>

  <div class="relative z-10 flex flex-col items-center text-center px-6">
    <h1 class="error-text text-[15vw] md:text-[200px] font-sans font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/50 to-background leading-none">
      {$page.status}
    </h1>
    <h2 class="error-text text-2xl md:text-4xl font-serif tracking-tight text-foreground mt-4 mb-8">
      {$page.error?.message || 'Signal Lost in the Void.'}
    </h2>
    
    <a href="/" class="error-text group flex items-center gap-3 px-8 py-4 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-sans font-bold tracking-widest uppercase hover:bg-primary hover:text-[#0d0c0c] hover:shadow-[0_0_30px_rgba(212,176,85,0.3)] transition-all duration-500">
      <ArrowLeft class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
      Return to Base
    </a>
  </div>
</div>