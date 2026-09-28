import { serviciosData } from '$lib/data/servicios';
import { REGIONES, SITE_URL } from '$lib/seo/site';

export const prerender = true;

interface Entrada {
	path: string;
	changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
	priority: string;
}

/**
 * El sitemap declara solo lo indexable: quedan fuera `/ingreso` y la API.
 * El catálogo de formación se movió al campus, así que sus URLs salen de aquí
 * y `hooks.server.ts` las redirige con 301.
 */
const entradas: Entrada[] = [
	{ path: '/', changefreq: 'weekly', priority: '1.0' },
	{ path: '/cobertura', changefreq: 'monthly', priority: '0.9' },
	{ path: '/trabaja-con-nosotros', changefreq: 'monthly', priority: '0.9' },
	{ path: '/politicas-de-privacidad', changefreq: 'yearly', priority: '0.3' },
	...Object.keys(serviciosData).map(
		(slug): Entrada => ({
			path: `/servicios/${slug}`,
			changefreq: 'monthly',
			priority: '0.8'
		})
	),
	...REGIONES.map(
		(region): Entrada => ({
			path: `/cobertura/${region.slug}`,
			changefreq: 'monthly',
			priority: '0.8'
		})
	)
];

export async function GET() {
	const lastmod = new Date().toISOString().slice(0, 10);

	const urls = entradas
		.map(
			(entrada) => `	<url>
		<loc>${SITE_URL}${entrada.path === '/' ? '/' : entrada.path}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>${entrada.changefreq}</changefreq>
		<priority>${entrada.priority}</priority>
	</url>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
