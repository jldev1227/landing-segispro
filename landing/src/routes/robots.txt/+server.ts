import { SITE_URL } from '$lib/seo/site';

export const prerender = true;

/**
 * Se sirve desde una ruta y no desde `static/` para que la directiva `Sitemap`
 * use el mismo origen canónico que el resto del SEO.
 */
export async function GET() {
	// `/ingreso` y las pasarelas de pago NO se bloquean aquí: llevan `noindex` en la
	// página y bloquearlas impediría que el rastreador llegue a leer esa directiva.
	const body = `User-agent: *
Allow: /

# La API no devuelve contenido indexable.
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=86400'
		}
	});
}
