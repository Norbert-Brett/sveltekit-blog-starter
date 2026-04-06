<script>
	import { siteTitle } from '$lib/config';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger);
	}

	let sectionRef = $state();

	onMount(() => {
		const ctx = gsap.context(() => {
			gsap.from(".reveal-text", {
				y: 30,
				opacity: 0,
				duration: 1,
				stagger: 0.2,
				ease: "power3.out",
				scrollTrigger: {
					trigger: sectionRef,
					start: "top 80%",
				}
			});
		}, sectionRef);

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>About | {siteTitle}</title>
</svelte:head>

<section bind:this={sectionRef} class="min-h-[80vh] py-24 px-4 w-full relative">
	<div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div class="absolute top-1/2 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
    </div>

	<div class="max-w-4xl mx-auto z-10 relative">
		<h1 class="reveal-text text-5xl md:text-7xl font-black tracking-tighter mb-12 text-white">
			About <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">Me.</span>
		</h1>

		<div class="space-y-8 text-lg  text-muted-foreground leading-relaxed font-light reveal-text">
			<p>
				I am a creative software engineer focused on building premium, interactive digital experiences. My core expertise lies precisely at the intersection of beautiful UI design and robust systems engineering. 
			</p>
			
			<p>
				Working primarily with the Svelte ecosystem, I strive to eliminate overhead while maximizing performance, creating silky-smooth, GSAP-powered motion interactions that feel like a native application standard.
			</p>

			<div class="mt-16 reveal-text">
				<h2 class="text-2xl font-bold text-white mb-6">Expertise ⚡</h2>
				<ul class="grid grid-cols-2 md:grid-cols-3 gap-4">
					<li class="bg-black/40 border border-white/10 rounded-full py-2 px-4 text-center text-sm font-medium hover:border-primary transition-all text-white">Svelte & SvelteKit</li>
					<li class="bg-black/40 border border-white/10 rounded-full py-2 px-4 text-center text-sm font-medium hover:border-primary transition-all text-white">GSAP Analytics</li>
					<li class="bg-black/40 border border-white/10 rounded-full py-2 px-4 text-center text-sm font-medium hover:border-primary transition-all text-white">Framer Motion</li>
					<li class="bg-black/40 border border-white/10 rounded-full py-2 px-4 text-center text-sm font-medium hover:border-primary transition-all text-white">Tailwind CSS v4</li>
					<li class="bg-black/40 border border-white/10 rounded-full py-2 px-4 text-center text-sm font-medium hover:border-primary transition-all text-white">Accessibility</li>
					<li class="bg-black/40 border border-white/10 rounded-full py-2 px-4 text-center text-sm font-medium hover:border-primary transition-all text-white">Static Generation</li>
				</ul>
			</div>
		</div>
	</div>
</section>
