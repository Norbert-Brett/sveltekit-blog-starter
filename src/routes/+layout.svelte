<script>
	import './layout.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import WebGLBackground from '$lib/components/WebGLBackground.svelte';
	import { appState } from '$lib/state.svelte.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { siteTitle, siteURL, siteDescription } from '$lib/config.js';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { MetaTags } from 'svelte-meta-tags';

	let { data, children } = $props();
	const transitionIn = { delay: 150, duration: 150 };
	const transitionOut = { duration: 100 };

	$effect(() => {
		appState.currentPage = data.path;
	});

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		appState.isMenuOpen = false;
	});
</script>

<MetaTags
	title={siteTitle}
	titleTemplate="%s"
	description={siteDescription}
	canonical="https://{siteURL}/"
	openGraph={{
		type: 'website',
		url: `https://${siteURL}/`,
		title: siteTitle,
		description: siteDescription,
		site_name: siteTitle,
		images: [
			{
				url: 'https://res.cloudinary.com/nbrett/image/upload/v1725625689/IMG_0698_d0nhun.jpg',
				width: 1200,
				height: 630,
				alt: 'Norbert Brettschneider'
			}
		]
	}}
	twitter={{
		handle: '@norbertbr3tt',
		site: '@norbertbr3tt',
		cardType: 'summary_large_image',
		title: siteTitle,
		description: siteDescription,
		image: 'https://res.cloudinary.com/nbrett/image/upload/v1725625689/IMG_0698_d0nhun.jpg'
	}}
	additionalLink={[{ rel: 'alternate', type: 'application/rss+xml', title: siteTitle, href: `https://${siteURL}/api/rss.xml` }]}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': ['Person', 'WebSite'],
		'name': 'Norbert Brettschneider',
		'alternateName': ['br3tt', 'norbert br3tt', 'norbert brett'],
		'url': 'https://br3tt.vercel.app/',
		'image': 'https://res.cloudinary.com/nbrett/image/upload/v1725625689/IMG_0698_d0nhun.jpg',
		'jobTitle': 'FullStack Developer & AI Specialist',
		'description': 'Norbert Brettschneider (br3tt) is a full-stack developer and AI specialist specializing in user-centered digital experiences.',
		'sameAs': [
			'https://github.com/br3tt',
			'https://twitter.com/norbertbr3tt',
			'https://linkedin.com/in/norbertbrettschneider'
		],
		'knowsAbout': [
			'Artificial Intelligence',
			'Full-Stack Development',
			'Large Language Models (LLMs)',
			'SvelteKit',
			'UI/UX Design',
			'Generative AI'
		]
	}}
/>

<div class="layout min-h-screen flex flex-col transition-colors duration-1000 text-foreground" class:open={appState.isMenuOpen}>
	<!-- Cinematic Transition Overlay -->
	<div id="transition-overlay">
		<div class="t-col"></div>
		<div class="t-col"></div>
		<div class="t-col"></div>
		<div class="t-col"></div>
		<div class="t-col"></div>
	</div>

	<!-- Scroll Progress Bar -->
	<div class="scroll-progress"></div>

	<WebGLBackground />
	<Header />

	{#key data.path}
		<main id="main" tabindex="-1" class="grow pt-24 overflow-x-hidden" in:fade|global={transitionIn} out:fade|global={transitionOut}>
			{@render children?.()}
        </main>
	{/key}

	<Footer />
</div>
