<!-- This file renders each individual blog post for reading. Be sure to update the svelte:head below -->
<script>
    import { onMount } from 'svelte';
	import gsap from 'gsap';
    
	let { data } = $props();

	let title = $derived(data.meta.title);
	let excerpt = $derived(data.meta.excerpt);
	let date = $derived(data.meta.date);
	let updated = $derived(data.meta.updated);
	let coverImage = $derived(data.meta.coverImage);
	let coverWidth = $derived(data.meta.coverWidth);
	let coverHeight = $derived(data.meta.coverHeight);
	let categories = $derived(data.meta.categories);
	let PostContent = $derived(data.PostContent);
    
    let progressRef = $state();

    onMount(() => {
        const updateProgress = () => {
            const scrollPx = document.documentElement.scrollTop;
            const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = `${scrollPx / winHeightPx * 100}%`;
            
            if(progressRef) gsap.to(progressRef, { width: scrolled, duration: 0.1 });
        };
        
        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    });
</script>

<svelte:head>
	<title>{title}</title>
	<meta data-key="description" name="description" content={excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta property="og:description" content={excerpt} />
	<meta name="twitter:description" content={excerpt} />
	<meta property="og:image:width" content={coverWidth} />
	<meta property="og:image:height" content={coverHeight} />
</svelte:head>

<div class="fixed top-0 left-0 w-full h-1 z-50 bg-black/50">
    <div bind:this={progressRef} class="h-full bg-primary w-0"></div>
</div>

<article class="max-w-3xl mx-auto py-24 px-4 relative z-10 w-full">
    <header class="mb-16 text-center">
        {#if categories}
            <div class="flex justify-center gap-2 mb-6">
                {#each categories as category}
                    <span class="text-xs uppercase tracking-wider text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        {category}
                    </span>
                {/each}
            </div>
        {/if}

        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8">
            {title}
        </h1>

        <div class="flex items-center justify-center gap-4 text-sm text-muted-foreground font-medium">
            <time datetime={date}>{date}</time>
            {#if updated && updated !== date}
                <span class="w-1 h-1 rounded-full bg-border"></span>
                <span>Updated: <time datetime={updated}>{updated}</time></span>
            {/if}
        </div>
    </header>

    {#if coverImage}
        <figure class="mb-16 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <img
                class="w-full h-auto object-cover"
                src={coverImage}
                alt={title}
                style="aspect-ratio: {coverWidth} / {coverHeight};"
                width={coverWidth}
                height={coverHeight}
                loading="lazy"
            />
        </figure>
    {/if}

	<div class="prose prose-invert prose-p:text-muted-foreground prose-headings:text-white prose-a:text-primary hover:prose-a:text-yellow-400 prose-blockquote:border-primary prose-blockquote:bg-black/40 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg max-w-none">
	    <PostContent />
    </div>

	{#if categories}
		<aside class="mt-20 pt-10 border-t border-white/10">
			<h2 class="text-white text-lg font-bold mb-6 flex items-center gap-2">
                <span class="w-6 h-[2px] bg-primary"></span> Tags
            </h2>
			<ul class="flex flex-wrap gap-3">
				{#each categories as category}
					<li>
						<span class="bg-black/40 border border-white/10 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground">
							#{category}
						</span>
					</li>
				{/each}
			</ul>
		</aside>
	{/if}
</article>
