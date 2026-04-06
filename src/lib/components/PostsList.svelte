<script>
	let { posts = [] } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
	{#each posts as post}
        <a href="/articles/{post.slug}" class="group block h-full">
            <article class="h-full bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md hover:border-primary/50 transition-all duration-300 flex flex-col shadow-lg hover:shadow-primary/10">
                
                {#if post.coverImage}
                    <div class="w-full relative overflow-hidden" style="aspect-ratio: 16/9;">
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                        <img
                            src={post.coverImage}
                            alt=""
                            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                        />
                    </div>
                {/if}
                
                <div class="p-6 md:p-8 flex-grow flex flex-col">
                    <div class="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-primary">
                        {#if post.categories && post.categories.length > 0}
                            <span>{post.categories[0]}</span>
                        {/if}
                        <span class="w-1 h-1 rounded-full bg-white/20"></span>
                        <time class="text-muted-foreground">{post.date}</time>
                    </div>

                    <h2 class="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h2>

                    <p class="text-muted-foreground font-light leading-relaxed mb-6 flex-grow line-clamp-3">
                        {post.excerpt}
                    </p>

                    <div class="mt-auto flex items-center text-sm font-medium text-white group-hover:text-primary transition-colors">
                        Read Article 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2 transform group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                </div>
            </article>
        </a>
	{/each}
</div>