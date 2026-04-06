<script>
	import { siteTitle } from '$lib/config';
	import Hero from '$lib/components/Hero.svelte';
	import Stats from '$lib/components/Stats.svelte';
</script>

<svelte:head>
	<title>{siteTitle} | Portfolio</title>
</svelte:head>

<Hero />
<Stats />

<section class="py-24 relative z-10 w-full mb-20 overflow-visible">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-8 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md hover:border-primary/50 transition-colors group">
                <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <h3 class="text-xl font-bold text-white mb-3">Premium Design</h3>
                <p class="text-muted-foreground text-sm leading-relaxed">Detailed, pixel-perfect layouts using modern UI patterns and tailored themes for a stunning impression.</p>
            </div>
            <div class="p-8 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md hover:border-primary/50 transition-colors group">
                <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <h3 class="text-xl font-bold text-white mb-3">Performant Logic</h3>
                <p class="text-muted-foreground text-sm leading-relaxed">Architected with minimal payloads, utilizing SvelteKit's static generation for instantaneous load times.</p>
            </div>
            <div class="p-8 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md hover:border-primary/50 transition-colors group">
                <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary/20 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
                <h3 class="text-xl font-bold text-white mb-3">Motion Kinetics</h3>
                <p class="text-muted-foreground text-sm leading-relaxed">Fluid, dynamic interfaces powered by GSAP and Motion for interactive, premium user experiences.</p>
            </div>
        </div>
    </div>
</section>
