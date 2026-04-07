<script>
	import { siteTitle } from '$lib/config';
	import { MetaTags } from 'svelte-meta-tags';
	import Hero from '$lib/components/Hero.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import HeroAbout from '$lib/components/HeroAbout.svelte';
	import AIShowcase from '$lib/components/AIShowcase.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import LatestInsights from '$lib/components/LatestInsights.svelte';
    import FoundationalQuote from '$lib/components/FoundationalQuote.svelte';

	let { data } = $props();
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

