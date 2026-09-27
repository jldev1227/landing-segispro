import type { Handle } from '@sveltejs/kit';

/** Campus institucional al que se movió todo el catálogo de formación. */
const CAMPUS = 'https://formarpro.segispro.com';

/**
 * Rutas retiradas de la landing y su destino en el campus.
 *
 * Son redirecciones **301**, permanentes: una 302 o una 307 le dicen a Google
 * que la URL original volverá, y no transfieren la autoridad acumulada. Borrar
 * sin más y devolver 404 la perdería del todo.
 *
 * `/capacitaciones/<slug>` no tiene equivalente uno a uno — el campus no expone
 * fichas con esos slugs —, así que todas las fichas caen en el listado. Google
 * trata una redirección masiva a una sola página como un soft 404 y transfiere
 * menos señal que un destino equivalente, pero sigue siendo mejor que un 404.
 */
const RETIRADAS: { patron: RegExp; destino: string }[] = [
	{ patron: /^\/capacitaciones\/?$/, destino: `${CAMPUS}/cursos` },
	{ patron: /^\/capacitaciones\/.+/, destino: `${CAMPUS}/cursos` }
];

export const handle: Handle = async ({ event, resolve }) => {
	const ruta = event.url.pathname;

	for (const { patron, destino } of RETIRADAS) {
		if (patron.test(ruta)) {
			return new Response(null, {
				status: 301,
				headers: {
					location: destino,
					// Sin esto Vercel cachearía la redirección como el resto del HTML.
					'cache-control': 'public, max-age=0, s-maxage=86400'
				}
			});
		}
	}

	return resolve(event);
};
