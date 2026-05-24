<script>
	import { MetaTags } from 'svelte-meta-tags';
	import Hero from '$lib/components/Hero.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import HeroAbout from '$lib/components/HeroAbout.svelte';
	import AIShowcase from '$lib/components/AIShowcase.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import LatestInsights from '$lib/components/LatestInsights.svelte';
    import FoundationalQuote from '$lib/components/FoundationalQuote.svelte';


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
<HeroAbout />
<AIShowcase />
<Testimonials />
<LatestInsights posts={data.posts} />
<FoundationalQuote />
