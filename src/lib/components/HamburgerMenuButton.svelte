<script>
	import { appState } from '$lib/state.svelte.js';
	import HamburgerSVG from './svg/HamburgerSVG.svelte';
	import XSVG from './svg/XSVG.svelte';

	let { closeOnly = false } = $props();

	const toggleIsMenuOpen = () => {
		appState.isMenuOpen = !appState.isMenuOpen;
	};
</script>

<button
	onclick={toggleIsMenuOpen}
	aria-pressed={appState.isMenuOpen}
	class="menu-button text-primary hover:text-white transition-colors"
	tabindex={appState.isMenuOpen || !closeOnly ? '0' : '-1'}
>
	<span class="sr-only">Toggle hamburger menu</span>
	{#if closeOnly}
		<XSVG />
	{:else}
		<HamburgerSVG />
	{/if}
</button>
