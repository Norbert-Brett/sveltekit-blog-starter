<script>
	import { appState } from '$lib/state.svelte.js';

	let { href, children } = $props();

	let isCurrentPage = $derived(appState.currentPage.startsWith(href));

	const maybeCloseMenu = () => {
		if (href != appState.currentPage) {
			appState.isMenuOpen = false;
		}
	};
</script>

<li>
	<a
		{href}
		onclick={maybeCloseMenu}
		class:active={isCurrentPage}
		aria-current={isCurrentPage ? 'page' : false}
		class="text-foreground hover:text-primary transition-colors {isCurrentPage ? 'text-primary font-bold' : ''}"
	>
		{@render children?.()}
	</a>
</li>
