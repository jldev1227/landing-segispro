import { error } from '@sveltejs/kit';
import { serviciosData } from '$lib/data/servicios';

export const prerender = true;

/** El portafolio es un conjunto cerrado: se prerenderizan todas sus páginas. */
export function entries() {
	return Object.keys(serviciosData).map((slug) => ({ slug }));
}

export function load({ params }: { params: { slug: string } }) {
	const servicio = serviciosData[params.slug];
	// Antes se renderizaba «Servicio no encontrado» con estado 200: un soft 404.
	if (!servicio) error(404, 'Servicio no encontrado');
	return { servicio };
}
