<script>
	import { cn } from "$lib/utils";
	let {
		children,
		class: className = "",
		reverse = false,
		pauseOnHover = false,
		vertical = false,
		repeat = 10,
		...rest
	} = $props();
</script>

<div
	{...rest}
	class={cn(
		"group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
		{
			"flex-row": !vertical,
			"flex-col": vertical,
		},
		className
	)}
>
	<div
		class={cn("flex shrink-0 justify-around gap-(--gap)", {
			"animate-marquee flex-row": !vertical,
			"animate-marquee-vertical flex-col": vertical,
			"group-hover:[animation-play-state:paused]": pauseOnHover,
			"[animation-direction:reverse]": reverse,
		})}
	>
		{#each Array(repeat).fill(0) as _, i (i)}
			{@render children?.()}
		{/each}
	</div>
	<div
		aria-hidden="true"
		class={cn("flex shrink-0 justify-around gap-(--gap)", {
			"animate-marquee flex-row": !vertical,
			"animate-marquee-vertical flex-col": vertical,
			"group-hover:[animation-play-state:paused]": pauseOnHover,
			"[animation-direction:reverse]": reverse,
		})}
	>
		{#each Array(repeat).fill(0) as _, i (i)}
			{@render children?.()}
		{/each}
	</div>
</div>