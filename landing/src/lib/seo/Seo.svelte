<script lang="ts">
	/**
	 * Metadatos de una página. Centraliza título, descripción, canónico, Open Graph,
	 * Twitter y JSON-LD para que ninguna ruta se quede a medias.
	 */
	import { OG_IMAGE, SITE_LOCALE, SITE_NAME, SITE_SHORT_NAME, absoluteUrl } from './site';

	interface Props {
		title: string;
		description: string;
		/** Ruta relativa, p. ej. `/servicios/interventoria`. */
		path: string;
		image?: string;
		/** `article` para contenido fechado; el resto del sitio es `website`. */
		type?: 'website' | 'article';
		/** Páginas transaccionales o privadas que no deben indexarse. */
		noindex?: boolean;
		/** Nodos de schema.org ya construidos; se emiten en un único `@graph`. */
		schema?: object | null;
	}

	let {
		title,
		description,
		path,
		image = OG_IMAGE,
		type = 'website',
		noindex = false,
		schema = null
	}: Props = $props();

	const canonical = $derived(absoluteUrl(path));
	const imagenAbsoluta = $derived(image.startsWith('http') ? image : absoluteUrl(image));

	/**
	 * Una etiqueta de cierre de script dentro del JSON cerraría el bloque antes de
	 * tiempo. Escapamos el `<` en su forma unicode, que sigue siendo JSON válido.
	 */
	const jsonLd = $derived(schema ? JSON.stringify(schema).replace(/</g, '\\u003c') : null);
	/** Se arma por concatenación: la etiqueta literal cerraría este bloque. */
	const cierre = '<' + '/script>';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{:else}
		<meta
			name="robots"
			content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
		/>
	{/if}

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_SHORT_NAME} />
	<meta property="og:locale" content={SITE_LOCALE} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imagenAbsoluta} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={SITE_NAME} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imagenAbsoluta} />

	{#if jsonLd}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<script type="application/ld+json">${jsonLd}${cierre}`}
	{/if}
</svelte:head>
