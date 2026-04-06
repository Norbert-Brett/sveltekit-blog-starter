<script>
	import './layout.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import WebGLBackground from '$lib/components/WebGLBackground.svelte';
	import { appState } from '$lib/state.svelte.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { siteTitle, siteURL } from '$lib/config.js';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title={siteTitle} href="http://{siteURL}/api/rss.xml" />
</svelte:head>

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
		<main id="main" tabindex="-1" class="flex-grow pt-24 overflow-x-hidden" in:fade|global={transitionIn} out:fade|global={transitionOut}>
			{@render children?.()}
        </main>
	{/key}

	<Footer />
</div>
