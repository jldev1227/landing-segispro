<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageFooter from '$lib/components/PageFooter.svelte';
</script>

<svelte:head>
	<title>{$page.status} · Página no encontrada | SEGISPRO</title>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<PageHeader />

<main
	class="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-white via-gray-50 to-blue-50 px-6 pt-24 pb-20 text-center"
>
	<p class="mb-3 text-6xl font-bold text-blue-600">{$page.status}</p>
	<h1 class="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
		{$page.error?.message ?? 'Página no encontrada'}
	</h1>
	<p class="mb-8 max-w-md text-sm leading-relaxed text-gray-600">
		El contenido que buscas cambió de dirección o ya no está disponible.
	</p>
	<div class="flex flex-wrap justify-center gap-3">
		<a
			href={resolve('/')}
			class="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
		>
			Ir al inicio
		</a>
		<a
			href={resolve('/capacitaciones')}
			class="rounded-full border-2 border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
		>
			Ver capacitaciones
		</a>
		<a
			href={resolve('/cobertura')}
			class="rounded-full border-2 border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400"
		>
			Cobertura
		</a>
	</div>
</main>

<PageFooter />
