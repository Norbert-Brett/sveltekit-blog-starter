<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let { onComplete } = $props();


	let container = $state(null);
	let counterElement;
	let percentage = $state(0);

	onMount(() => {
		// Prevent scrolling while preloader is active
		document.body.style.overflow = 'hidden';

		const tl = gsap.timeline({
			onComplete: () => {
				document.body.style.overflow = '';
				if (onComplete) onComplete();
			}
		});

		// Animate the counter from 0 to 100
		tl.to(
			{ val: 0 },
			{
				val: 100,
				duration: 2.5,
				ease: 'expo.inOut',
				onUpdate: function () {
					percentage = Math.round(this.targets()[0].val);
				}
			}
		);

		// Animate the preloader mask splitting open or fading up
		tl.to(
			container,
			{
				yPercent: -100,
				duration: 1.2,
				ease: 'expo.inOut',
				delay: 0.2
			},
			'+=0.1'
		);
	});
</script>

<div
	bind:this={container}
	class="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-background text-foreground"
>
	<div class="absolute inset-0 flex items-center justify-center overflow-hidden">
		<!-- Background subtle noise for the preloader -->
		<div class="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E');"></div>
	</div>

	<div class="relative z-10 flex flex-col items-center">
		<h1 class="text-6xl md:text-8xl font-serif font-light tracking-tighter">
			<span bind:this={counterElement}>{percentage}</span><span class="text-accent">%</span>
		</h1>
		<div class="mt-4 h-[2px] w-48 overflow-hidden rounded-full bg-border">
			<div 
				class="h-full bg-accent transition-all duration-100 ease-out" 
				style="width: {percentage}%"
			></div>
		</div>
		<p class="mt-6 text-sm uppercase tracking-widest text-muted-foreground/60 font-mono">
			Initializing Experience
		</p>
	</div>
</div>
