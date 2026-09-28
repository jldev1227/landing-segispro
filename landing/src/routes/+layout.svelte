<script lang="ts">
	import '../app.css';
	import { inject } from '@vercel/analytics';
	import { page } from '$app/state';
	import BotonWhatsApp from '$lib/components/BotonWhatsApp.svelte';

	inject();

	let { children } = $props();

	/**
	 * El acceso a WhatsApp va en todas las páginas públicas menos la de ingreso:
	 * quien está poniendo una contraseña no está cotizando, y ahí el botón solo
	 * tapa el formulario.
	 */
	const conWhatsApp = $derived(!page.url.pathname.startsWith('/ingreso'));
</script>

{#if children}
	{@render children()}
{/if}

{#if conWhatsApp}
	<BotonWhatsApp />
{/if}
