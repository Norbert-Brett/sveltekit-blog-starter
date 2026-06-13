<script>
	import { onMount } from 'svelte';

	export let type = 'text'; // text, image, title, paragraph, avatar, etc.
	export let count = 1; // for multiple items
	export let className = '';

	let isLoaded = false;

	onMount(() => {
		// Simulate content loading - in real app, this would be replaced by actual content
		setTimeout(() => {
			isLoaded = true;
		}, Math.random() * 800 + 400); // Random delay between 400ms-1200ms for natural feel
	});

	// Generate skeleton shapes based on type
	function getSkeletonShape() {
		switch (type) {
			case 'avatar':
				return 'rounded-full';
			case 'image':
				return 'rounded';
			case 'title':
				return 'h-8 w-3/4';
			case 'paragraph':
				return 'h-4 w-2/3';
			default:
				return 'h-4 w-full';
		}
	}
</script>

{#if !isLoaded}
	<div class="animate-pulse {className}">
		{#if type === 'avatar'}
			<div class="w-12 h-12 {getSkeletonShape()} bg-muted/50"></div>
		{:else if type === 'image'}
			<div class="w-24 h-16 {getSkeletonShape()} bg-muted/50"></div>
		{:else if type === 'title'}
			<div class="{getSkeletonShape()} bg-muted/50 mb-2"></div>
			<div class="h-4 w-1/2 bg-muted/50 mt-2"></div>
		{:else if type === 'paragraph'}
			<div class="{getSkeletonShape()} bg-muted/50 mb-1"></div>
			<div class="h-4 w-3/4 bg-muted/50 mt-1"></div>
			<div class="h-4 w-1/2 bg-muted/50 mt-1"></div>
		{:else}
			<div class="{getSkeletonShape()} bg-muted/50"></div>
		{/if}
	</div>
{:else}
	<slot />
{/if}

<style>
	.bg-muted\/50 {
		background-color: var(--color-muted);
		opacity: 0.5;
		border-radius: var(--rounded-md, 0.375rem);
	}

	.animate-pulse {
		animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 0.5;
		}
		50% {
			opacity: 0.8;
		}
	}
</style>