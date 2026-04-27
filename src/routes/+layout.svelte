<script>
	import './layout.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import WebGLBackground from '$lib/components/WebGLBackground.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import Preloader from '$lib/components/Preloader.svelte';
	import { appState } from '$lib/state.svelte.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { siteTitle, siteURL, siteDescription } from '$lib/config.js';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { MetaTags } from 'svelte-meta-tags';
	import Lenis from 'lenis';

	let { data, children } = $props();
	let transitionOverlay = $state(null);
	let showPreloader = $state(true);
	const transitionIn = { delay: 150, duration: 150 };
	const transitionOut = { duration: 100 };

	$effect(() => {
		appState.currentPage = data.path;
	});

	onMount(() => {
		// Check preloader state
		if (sessionStorage.getItem('preloaderPlayed') === 'true') {
			showPreloader = false;
		} else {
			sessionStorage.setItem('preloaderPlayed', 'true');
		}

		gsap.registerPlugin(ScrollTrigger);
		appState.isMenuOpen = false;

		// Initialize Lenis Smooth Scrolling
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			direction: 'vertical',
			gestureDirection: 'vertical',
			smooth: true,
		});

		// Sync GSAP ScrollTrigger with Lenis
		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});
		gsap.ticker.lagSmoothing(0, 0);

		// Initialize Scroll Progress Bar
		gsap.set('.scroll-progress', { scaleX: 0 });
		gsap.to('.scroll-progress', {
			scaleX: 1,
			ease: 'none',
			scrollTrigger: {
				trigger: document.body,
				start: 'top top',
				end: 'bottom bottom',
				scrub: 0.3
			}
		});

		return () => {
			lenis.destroy();
			gsap.ticker.remove(lenis.raf);
		};
	});

	beforeNavigate(({ willUnload }) => {
		if (willUnload || !transitionOverlay) return;
		const cols = transitionOverlay.querySelectorAll('.t-col');
		gsap.fromTo(cols, 
			{ scaleY: 0, transformOrigin: 'bottom' },
			{ scaleY: 1, duration: 0.5, stagger: 0.05, ease: 'expo.inOut' }
		);
	});

	afterNavigate(() => {
		if (!transitionOverlay) return;
		const cols = transitionOverlay.querySelectorAll('.t-col');
		gsap.to(cols, {
			scaleY: 0,
			transformOrigin: 'top',
			duration: 0.5,
			stagger: 0.05,
			ease: 'expo.inOut',
			delay: 0.1,
			onComplete: () => ScrollTrigger.refresh()
		});
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
	{#if showPreloader}
		<Preloader onComplete={() => showPreloader = false} />
	{/if}

	<CustomCursor />

	<!-- Cinematic Transition Overlay -->
	<div bind:this={transitionOverlay} id="transition-overlay">
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
