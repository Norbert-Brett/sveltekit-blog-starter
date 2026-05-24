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
	<div class="relative z-10 flex flex-col items-center">
		<h1 class="text-6xl md:text-8xl font-sans font-light tracking-tighter text-foreground">
			<span bind:this={counterElement}>{percentage}</span><span class="text-foreground/50">%</span>
		</h1>
		<div class="mt-8 h-px w-48 overflow-hidden bg-foreground/10">
			<div 
				class="h-full bg-accent transition-all duration-100 ease-out" 
				style="width: {percentage}%"
			></div>
		</div>
		<p class="mt-6 text-xs tracking-widest text-foreground/50 font-sans font-medium uppercase">
			Loading Experience
		</p>
	</div>
</div>
