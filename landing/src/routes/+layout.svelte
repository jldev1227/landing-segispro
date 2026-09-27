<script lang="ts">
	import '../app.css';
	import { inject } from '@vercel/analytics';

	inject();

	let { children } = $props();
</script>

{#if children}
	{@render children()}
{/if}
