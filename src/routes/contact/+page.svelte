<script>
	import { siteTitle } from '$lib/config';
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let formRef;
	let headlineRef;

	onMount(() => {
		const ctx = gsap.context(() => {
			gsap.from(headlineRef, {
				y: 30,
				opacity: 0,
				duration: 0.8,
				ease: "power3.out"
			});

			gsap.from(formRef.children, {
				y: 20,
				opacity: 0,
				duration: 0.8,
				stagger: 0.1,
				delay: 0.2,
				ease: "power3.out"
			});
		});

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>Contact | {siteTitle}</title>
</svelte:head>

<section class="min-h-[80vh] py-24 px-4 w-full relative">
	<div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div class="absolute top-1/2 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
    </div>

	<div class="max-w-2xl mx-auto z-10 relative">
		<div bind:this={headlineRef} class="text-center mb-16">
			<h1 class="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-white">
				Let's <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">Connect.</span>
			</h1>
			<p class="text-muted-foreground text-lg font-light">Have a project in mind or want to explore an opportunity? Drop me a message.</p>
		</div>

		<form bind:this={formRef} class="space-y-6 bg-black/40 border border-white/5 backdrop-blur-md p-8 md:p-12 rounded-2xl">
			<div class="flex flex-col space-y-2">
				<label for="name" class="text-sm font-medium text-white">Full Name</label>
				<input type="text" id="name" placeholder="John Doe" class="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
			</div>

			<div class="flex flex-col space-y-2">
				<label for="email" class="text-sm font-medium text-white">Email Address</label>
				<input type="email" id="email" placeholder="john@example.com" class="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
			</div>

			<div class="flex flex-col space-y-2">
				<label for="message" class="text-sm font-medium text-white">Message</label>
				<textarea id="message" rows="5" placeholder="How can I help you?" class="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"></textarea>
			</div>

			<button type="submit" class="w-full py-4 mt-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.2)]">
				Send Message
			</button>
		</form>
	</div>
</section>