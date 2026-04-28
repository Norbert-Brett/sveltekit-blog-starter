<script>
	import { MetaTags } from 'svelte-meta-tags';
	import Hero from '$lib/components/Hero.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import HeroAbout from '$lib/components/HeroAbout.svelte';
	import AIShowcase from '$lib/components/AIShowcase.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import LatestInsights from '$lib/components/LatestInsights.svelte';
    import FoundationalQuote from '$lib/components/FoundationalQuote.svelte';
	import { Marquee } from '$lib/components/magic/marquee';

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	let { data } = $props();
	let marqueeSection = $state(null);
	let ctx;

	onMount(() => {
		if (!browser || !marqueeSection) return;
		gsap.registerPlugin(ScrollTrigger);

		ctx = gsap.context(() => {
			// The Whip: Marquees fly in horizontally and brake into their CSS infinite loop
			gsap.fromTo('.marquee-whip-1',
				{ x: '100vw', opacity: 0, skewX: -20 },
				{ 
					x: 0, opacity: 1, skewX: 0, 
					duration: 1.5, ease: 'power4.out',
					scrollTrigger: { trigger: marqueeSection, start: 'top 80%' }
				}
			);
			gsap.fromTo('.marquee-whip-2',
				{ x: '-100vw', opacity: 0, skewX: 20 },
				{ 
					x: 0, opacity: 1, skewX: 0, 
					duration: 1.5, ease: 'power4.out', delay: 0.1,
					scrollTrigger: { trigger: marqueeSection, start: 'top 80%' }
				}
			);
		}, marqueeSection);

		return () => { if (ctx) ctx.revert(); };
	});

	onDestroy(() => { if (ctx) ctx.revert(); });
</script>

<MetaTags
	title="Portfolio"
/>

<Hero />
<Stats />
<div bind:this={marqueeSection} class="relative py-24 overflow-hidden bg-background flex flex-col gap-8">
	<!-- Decorative Borders -->
	<div class="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
	<div class="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
	
	<!-- Row 1: Solid Gold Text -->
	<div class="marquee-whip-1 w-full will-change-transform">
		<Marquee pauseOnHover class="[--duration:80s] [--gap:4rem] select-none">
			<span class="text-[6vh] md:text-[8vh] font-sans font-black tracking-tighter uppercase text-primary whitespace-nowrap px-4 leading-none">
				Open to work · Full Stack · AI/ML · Svelte · Node · Python · LLMs · 
			</span>
		</Marquee>
	</div>

	<!-- Row 2: Reversed & Outlined White Text -->
	<div class="marquee-whip-2 w-full will-change-transform">
		<Marquee reverse pauseOnHover class="z-10 [--duration:120s] [--gap:4rem] select-none">
			<span class="text-[6vh] md:text-[8vh] font-sans font-black tracking-tighter uppercase text-stroke-accent whitespace-nowrap px-4 leading-none opacity-80">
				Open to work · Full Stack · AI/ML · Svelte · Node · Python · LLMs · 
			</span>
		</Marquee>
	</div>
</div>
<HeroAbout />
<AIShowcase />
<Testimonials />
<LatestInsights posts={data.posts} />
<FoundationalQuote />
