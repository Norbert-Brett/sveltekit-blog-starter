<script>
	import './layout.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { appState } from '$lib/state.svelte.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { siteTitle, siteURL } from '$lib/config.js';

	let { data, children } = $props();
	const transitionIn = { delay: 150, duration: 150 };
	const transitionOut = { duration: 100 };

	$effect(() => {
		appState.currentPage = data.path;
	});

	onMount(() => {
		appState.isMenuOpen = false;
	});
</script>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title={siteTitle} href="http://{siteURL}/api/rss.xml" />
</svelte:head>

<div class="layout min-h-screen flex flex-col bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black/20 via-background to-black" class:open={appState.isMenuOpen}>
	<Header />

	{#key data.path}
		<main id="main" tabindex="-1" class="flex-grow pt-24" in:fade|global={transitionIn} out:fade|global={transitionOut}>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {@render children?.()}
            </div>
        </main>
	{/key}

	<Footer />
</div>
