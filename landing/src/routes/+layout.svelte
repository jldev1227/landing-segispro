<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { inject } from '@vercel/analytics';

	inject();

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if children}
	{@render children()}
{/if}
