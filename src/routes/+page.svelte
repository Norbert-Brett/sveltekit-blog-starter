<script>
	import { siteTitle } from '$lib/config';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger);
	}

	let heroRef = $state();
	let headlineRef = $state();

	onMount(() => {
		const ctx = gsap.context(() => {
			gsap.from(headlineRef.children, {
				y: 30,
				opacity: 0,
				duration: 1,
				stagger: 0.15,
				ease: "power3.out"
			});
		}, heroRef);

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>{siteTitle} | Portfolio</title>
</svelte:head>

<section bind:this={heroRef} class="min-h-[80vh] flex flex-col justify-center items-center text-center relative overflow-hidden">
    <div class="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]"></div>
    </div>

    <div bind:this={headlineRef} class="z-10 px-4">
        <h2 class="text-primary font-medium tracking-widest uppercase mb-4 text-xs md:text-sm">Creative Engineer</h2>
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-white leading-[1.1]">
            Building digital <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-yellow-600">experiences.</span>
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            I craft high-performance, premium web applications merging beautiful design with cutting-edge technology.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/articles" class="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                View Works
            </a>
            <a href="/contact" class="px-8 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/10">
                Contact Me
            </a>
        </div>
    </div>
</section>

<section class="py-24 relative z-10 w-full">
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
</section>
