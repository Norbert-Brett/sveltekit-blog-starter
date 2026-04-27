<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { siteTitle, siteEmail } from '$lib/config';
  import { PUBLIC_WEB3FORMS_ACCESS_KEY } from '$env/static/public';
  import gsap from 'gsap';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Label } from '$lib/components/ui/label';

  // Web3Forms Access Key from environment
  const WEB3FORMS_ACCESS_KEY = PUBLIC_WEB3FORMS_ACCESS_KEY;

  let state = $state({
    name: '',
    email: '',
    message: '',
    botcheck: ''
  });

  let isSubmitting = $state(false);
  let isSuccess = $state(false);
  let isError = $state(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;
    isError = false;

    try {
      const formData = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `New Contact Form Submission from ${state.name}`,
        name: state.name,
        email: state.email,
        message: state.message,
        botcheck: state.botcheck,
        from_name: 'Portfolio Contact Form'
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        isSuccess = true;
        state.name = '';
        state.email = '';
        state.message = '';
        setTimeout(() => {
          isSuccess = false;
        }, 5000);
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      isError = true;
    } finally {
      isSubmitting = false;
    }
  };

  const socialLinks = [
    { label: 'LinkedIn', icon: 'linkedin', to: 'https://linkedin.com/in/norbert-brett' },
    { label: 'GitHub', icon: 'github', to: 'https://github.com/norbert-brett' },
    { label: 'Email', icon: 'mail', to: `mailto:${siteEmail}` }
  ];

  const services = [
    { label: 'Web Development', icon: 'code-2' },
    { label: 'Technical Consulting', icon: 'lightbulb' },
    { label: 'AI Integration', icon: 'brain' },
    { label: 'Full-Stack Architecture', icon: 'layers' }
  ];

  let pageRef = $state(null);
  let ctx;

  const handleMouseMove = (e) => {
    const card = e.target.closest('.spotlight-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const titleLine1 = "Let's".split('');
  const titleLine2 = 'Connect.'.split('');

  onMount(() => {
    if (!browser || !pageRef) return;

    ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.05 });
      tl.fromTo('.ct-eyebrow', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out' });
      tl.fromTo('.ct-title-char', { y: 40, opacity: 0, rotateX: -30 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.5, stagger: 0.015, ease: 'expo.out' }, '-=0.3');
      tl.fromTo('.ct-subtitle', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out' }, '-=0.25');
      tl.fromTo('.ct-info-item, .ct-form-card', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'expo.out' }, '-=0.2');
      tl.fromTo('.ct-social', { y: 10, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.3, stagger: 0.03, ease: 'back.out(1.4)' }, '-=0.1');
    }, pageRef);

    return () => {
      if (ctx) ctx.revert();
    };
  });

  onDestroy(() => {
    if (ctx) ctx.revert();
  });
</script>

<svelte:head>
  <title>Contact | {siteTitle}</title>
</svelte:head>

<div bind:this={pageRef} onmousemove={handleMouseMove} class="min-h-screen text-white relative overflow-x-hidden pt-20" role="main">

  <!-- Ambient orbs -->
  <div class="absolute top-[5%] right-[5%] w-[50vw] h-[50vw] bg-primary/2.5 rounded-full blur-[180px] pointer-events-none"></div>
  <div class="absolute bottom-[10%] left-[0%] w-[40vw] h-[40vw] bg-white/1 rounded-full blur-[150px] pointer-events-none"></div>

  <!-- HERO -->
  <section class="relative pt-32 sm:pt-44 pb-16 sm:pb-24 px-6 sm:px-12">
    <div class="max-w-7xl mx-auto relative z-10">
      <div class="ct-eyebrow flex items-center gap-4 mb-8">
        <div class="h-px w-12 bg-primary"></div>
        <span class="text-xs font-sans font-medium text-primary/70 tracking-widest uppercase">Contact</span>
        <div class="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 rounded-full ml-4">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span class="text-xs font-sans font-semibold text-primary/90 tracking-widest uppercase">Available</span>
        </div>
      </div>

      <h1 class="text-[14vw] md:text-[10vw] lg:text-[9rem] font-bold font-sans tracking-tight leading-[0.85] mb-10 overflow-hidden">
        <span class="block">
          {#each titleLine1 as char, i}
            <span
              class="ct-title-char inline-block will-change-transform {char === ' ' ? 'w-[0.25em]' : ''}"
            >{char === ' ' ? '\u00A0' : char}</span>
          {/each}
        </span>
        <span class="block">
          {#each titleLine2 as char, i}
            <span
              class="ct-title-char inline-block will-change-transform {char === ' ' ? 'w-[0.25em]' : char === '.' ? 'text-primary' : ''}"
            >{char === ' ' ? '\u00A0' : char}</span>
          {/each}
        </span>
      </h1>

      <p class="ct-subtitle text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed">
        Ready to build high-performance systems.
        <span class="text-white/90">Let's discuss your next project.</span>
      </p>
    </div>

    <div class="max-w-7xl mx-auto mt-14 sm:mt-20">
      <div class="w-full h-px bg-linear-to-r from-primary/20 via-white/5 to-transparent"></div>
    </div>
  </section>

  <!-- MAIN CONTENT -->
  <section class="px-6 sm:px-12 pb-32 sm:pb-40">
    <div class="max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-12 gap-16 lg:gap-24">
        <div class="lg:col-span-5 space-y-12">
          <div class="ct-info-item">
            <span class="text-xs font-sans font-medium text-white/40 tracking-widest uppercase block mb-4">Direct Link</span>
            <a href="mailto:{siteEmail}" class="group flex items-center gap-3 interactive">
              <span class="text-xl md:text-2xl font-sans font-bold text-white group-hover:text-primary transition-colors duration-300">{siteEmail}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all text-primary"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </a>
            <p class="text-sm text-white/50 font-sans mt-3 leading-relaxed">
              Based in Budapest, Hungary<br>Operations: Global
            </p>
          </div>

          <div class="ct-info-item">
            <span class="text-xs font-sans font-medium text-white/40 tracking-widest uppercase block mb-5">Services</span>
            <div class="grid grid-cols-2 gap-3">
              {#each services as svc}
                <div class="group flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/1.5 hover:border-primary/20 hover:bg-white/3 transition-all duration-400">
                  <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {#if svc.icon === 'code-2'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-primary"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
                    {:else if svc.icon === 'lightbulb'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-primary"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.7 1.3 1.5 1.5 2.4"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                    {:else if svc.icon === 'brain'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-primary"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 5.886 4 4 0 0 0 6.587 4.774 4 4 0 0 0 6.587-4.774 4 4 0 0 0 .52-5.886 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5"/><path d="M9 13a4.5 4.5 0 0 0 3 4"/><path d="M6.003 5.125A3 3 0 1 0 12 5"/><path d="M12 5a4.5 4.5 0 0 0 3 4"/></svg>
                    {:else}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-primary"><path d="M12 3 3 7v10l9 4 9-4V7l-9-4Z"/><path d="m19 10-7 3.25L5 10"/><path d="M12 21v-7.75"/></svg>
                    {/if}
                  </div>
                  <span class="text-xs font-sans font-medium text-white/70 tracking-wide leading-tight">{ svc.label }</span>
                </div>
              {/each}
            </div>
          </div>

          <div class="ct-info-item p-6 rounded-2xl border border-white/5 bg-white/1.5">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-primary"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <span class="text-sm font-sans font-semibold text-white block">Response Time</span>
                <span class="text-xs font-sans text-white/50 tracking-wide">Within 24 Hours · Mon – Fri</span>
              </div>
            </div>
          </div>

          <div class="ct-info-item">
            <span class="text-xs font-sans font-medium text-white/40 tracking-widest uppercase block mb-5">Channels</span>
            <div class="flex gap-3">
              {#each socialLinks as link}
                <a href={link.to} target="_blank" class="ct-social group flex items-center gap-3 px-5 py-3.5 rounded-xl border border-white/5 bg-white/1.5 hover:border-primary/30 hover:bg-white/4 transition-all duration-400 interactive">
                  {#if link.icon === 'linkedin'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-white/50 group-hover:text-primary transition-colors duration-300"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454c.981 0 1.775-.773 1.775-1.729V1.729C24 .774 23.206 0 22.225 0z"/></svg>
                  {:else if link.icon === 'github'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-white/50 group-hover:text-primary transition-colors duration-300"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-white/50 group-hover:text-primary transition-colors duration-300"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  {/if}
                  <span class="text-xs font-sans font-medium tracking-wide text-white/70 group-hover:text-white transition-colors">{ link.label }</span>
                </a>
              {/each}
            </div>
          </div>
        </div>

        <div class="lg:col-span-7">
          <div class="ct-form-card spotlight-card relative p-8 md:p-12 rounded-3xl border border-white/5 bg-white/2 hover:border-primary/10 transition-all duration-500 overflow-hidden shadow-2xl">
            <div class="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" style="background: radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(41,151,255,0.04), transparent 50%);"></div>

            <div class="relative z-10 flex items-center justify-between mb-10">
              <div class="flex items-center gap-3">
                <span class="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span class="text-xs font-sans font-medium tracking-widest text-white/50 uppercase">Send a Message</span>
              </div>
              <span class="text-xs font-sans text-white/30 tracking-wide hidden sm:block">Secure Form</span>
            </div>

            {#if isSuccess}
              <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md rounded-3xl transition-all duration-500">
                <div class="w-20 h-20 rounded-full border-2 border-primary text-primary flex items-center justify-center mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h3 class="text-3xl font-sans font-bold mb-3 text-white">Message Sent</h3>
                <p class="text-white/60 font-sans text-sm mb-10 tracking-wide">I'll reply within 24 hours.</p>
                <Button variant="outline" class="px-8 py-3 rounded-full border border-white/20 text-sm font-sans font-medium tracking-wide hover:border-primary hover:text-primary transition-all duration-300" onclick={() => isSuccess = false}>
                  Send Another
                </Button>
              </div>
            {/if}

            <form onsubmit={onSubmit} class="space-y-8 relative z-10">
              <!-- Honeypot -->
              <input type="text" name="botcheck" bind:value={state.botcheck} class="hidden" style="display: none;">

              <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <Label for="name" class="font-sans text-xs font-medium tracking-widest text-white/40 uppercase">Name</Label>
                  <Input id="name" bind:value={state.name} placeholder="Your name" class="bg-white/3 border-white/10 text-white rounded-xl h-12" required />
                </div>
                <div class="space-y-2">
                  <Label for="email" class="font-sans text-xs font-medium tracking-widest text-white/40 uppercase">Email</Label>
                  <Input id="email" type="email" bind:value={state.email} placeholder="your@email.com" class="bg-white/3 border-white/10 text-white rounded-xl h-12" required />
                </div>
              </div>

              <div class="space-y-2">
                <Label for="message" class="font-sans text-xs font-medium tracking-widest text-white/40 uppercase">Message</Label>
                <Textarea id="message" bind:value={state.message} placeholder="Tell me about your project..." class="bg-white/3 border-white/10 text-white rounded-xl min-h-[150px]" required />
              </div>

              <div class="pt-2">
                <Button type="submit" size="lg" disabled={isSubmitting} class="w-full flex items-center justify-center gap-3 group relative overflow-hidden bg-primary text-white font-sans font-semibold text-sm h-14 hover:bg-primary/80 transition-all duration-400 rounded-full tracking-wide shadow-[0_0_40px_rgba(41,151,255,0.15)] hover:shadow-[0_0_60px_rgba(41,151,255,0.25)]">
                  {#if !isSubmitting}
                    <span>Send Message</span>
                  {:else}
                    <span>Sending...</span>
                  {/if}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Button>
                <p class="text-center mt-4 text-xs font-sans text-white/30 tracking-wide">
                  Your data is processed securely. No spam.
                </p>
                {#if isError}
                  <div class="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-sans tracking-wide text-center animate-in fade-in slide-in-from-top-1">
                    Something went wrong. Please try again or email me directly.
                  </div>
                {/if}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .ct-title-char {
    will-change: transform, opacity;
  }
</style>