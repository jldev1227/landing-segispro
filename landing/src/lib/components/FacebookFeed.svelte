<script lang="ts">
	/**
	 * Publicaciones recientes de Facebook mediante el Page Plugin.
	 *
	 * El iframe carga scripts y cookies de Facebook, así que **no se monta hasta
	 * que el bloque entra en pantalla**: en el primer render solo hay un marco
	 * con un enlace, y el coste llega cuando el usuario baja hasta aquí. Sin ese
	 * retraso el plugin compite por ancho de banda con el contenido de la página.
	 *
	 * Lo que se ve dentro del iframe no lo indexa Google. Por eso el bloque trae
	 * su propio encabezado y su propio enlace fuera del marco: eso sí es rastreable.
	 */
	import { onMount } from 'svelte';
	import { FACEBOOK_URL } from '$lib/seo/site';

	interface Props {
		/** Alto del plugin en píxeles. Facebook no lo ajusta al contenido. */
		alto?: number;
	}

	let { alto = 620 }: Props = $props();

	let contenedor: HTMLDivElement | null = $state(null);
	let visible = $state(false);

	const src = $derived(
		'https://www.facebook.com/plugins/page.php?' +
			new URLSearchParams({
				href: FACEBOOK_URL,
				tabs: 'timeline',
				width: '500',
				height: String(alto),
				small_header: 'false',
				adapt_container_width: 'true',
				hide_cover: 'false',
				show_facepile: 'true',
				locale: 'es_LA'
			}).toString()
	);

	onMount(() => {
		if (!contenedor) return;

		// Sin IntersectionObserver (navegadores muy viejos) se carga de una vez:
		// mejor el coste que un hueco vacío.
		if (!('IntersectionObserver' in window)) {
			visible = true;
			return;
		}

		const observador = new IntersectionObserver(
			(entradas) => {
				if (entradas.some((e) => e.isIntersecting)) {
					visible = true;
					observador.disconnect();
				}
			},
			// 300px de margen: el iframe empieza a cargar justo antes de verse.
			{ rootMargin: '300px' }
		);

		observador.observe(contenedor);
		return () => observador.disconnect();
	});
</script>

<div
	bind:this={contenedor}
	class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
	style="min-height: {alto}px"
>
	{#if visible}
		<iframe
			{src}
			title="Publicaciones recientes de SEGISPRO en Facebook"
			width="500"
			height={alto}
			style="border:none;overflow:hidden;width:100%"
			scrolling="no"
			frameborder="0"
			allowfullscreen={true}
			allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
			loading="lazy"
		></iframe>
	{:else}
		<div class="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
			<div class="h-10 w-10 animate-pulse rounded-full bg-blue-100"></div>
			<p class="text-sm text-gray-500">Cargando publicaciones…</p>
		</div>
	{/if}
</div>
