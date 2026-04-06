<script>
	import { siteAuthor, siteTitle } from '$lib/config';
	import NavItems from './NavItems.svelte';
</script>

<footer class="mt-20 border-t border-white/10 bg-black/40 backdrop-blur-sm py-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
		<div class="flex flex-col gap-4">
			<a href="/" class="text-2xl font-bold tracking-tight text-white hover:text-primary transition-colors">
				{siteTitle}<span class="text-primary">.</span>
			</a>
			<p class="text-sm text-muted-foreground w-3/4">
				Crafting premium digital experiences utilizing cutting-edge tech and high-end design.
			</p>
		</div>

		<div>
			<h3 class="text-lg font-semibold text-white mb-4">Navigation</h3>
			<nav>
				<ul class="flex flex-col gap-2">
					<NavItems />
				</ul>
			</nav>
		</div>
		
		<div>
			<h3 class="text-lg font-semibold text-white mb-4">Connect</h3>
			<nav>
				<ul class="flex flex-col gap-2">
					<li>
						<a href="/api/rss.xml" class="text-foreground hover:text-primary transition-colors" data-sveltekit-reload>RSS Feed</a>
					</li>
					<li>
						<a href="https://twitter.com" class="text-foreground hover:text-primary transition-colors">Twitter</a>
					</li>
					<li>
						<a href="https://github.com" class="text-foreground hover:text-primary transition-colors">GitHub</a>
					</li>
				</ul>
			</nav>
		</div>
	</div>

	<div class="mt-12 pt-8 border-t border-white/10 text-center">
		<p class="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} {siteAuthor}. All rights reserved.</p>
	</div>
</footer>
