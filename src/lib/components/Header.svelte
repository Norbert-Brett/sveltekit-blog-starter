<script>
	import { preventDefault } from 'svelte/legacy';
	import MainNav from './MainNav.svelte';
	import HamburgerMenuButton from './HamburgerMenuButton.svelte';
	import { siteTitle } from '$lib/config';

	const focusMain = () => {
		const main = document.querySelector('main');
		main.focus();
	}
</script>

<header class="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-6 py-4">
	<a onclick={preventDefault(focusMain)} class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:z-50" href="#main">
		Skip to main content
	</a>
	
	<a href="/" class="text-xl font-bold tracking-tight text-white hover:text-primary transition-colors duration-300">
		{siteTitle}<span class="text-primary">.</span>
	</a>
	
	<div class="flex items-center gap-4">
		<div class="hidden md:block">
			<MainNav />
		</div>
		<div class="md:hidden">
			<HamburgerMenuButton />
		</div>
	</div>
</header>