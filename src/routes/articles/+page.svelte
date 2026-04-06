<script>
	import PostsList from '$lib/components/PostsList.svelte';
	import { siteDescription } from '$lib/config';

	let { data } = $props();
</script>

<svelte:head>
	<title>Articles Directory</title>
	<meta data-key="description" name="description" content={siteDescription}>
</svelte:head>

<section class="min-h-[80vh] py-24 px-4 w-full relative">
	<div class="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"></div>
    </div>

	<div class="max-w-4xl mx-auto z-10 relative">
		<h1 class="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white">
			<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">Articles.</span>
		</h1>
        <p class="text-xl text-muted-foreground mb-16 font-light max-w-2xl">Thoughts, insights, and concepts deeply concerning modern frontend engineering and design architecture.</p>

        <div class="space-y-8">
		    <PostsList posts={data.posts} />
        </div>
	</div>
</section>