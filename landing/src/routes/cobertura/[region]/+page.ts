import { error } from '@sveltejs/kit';
import { REGIONES } from '$lib/seo/site';

export const prerender = true;

/** Las regiones son un conjunto cerrado, así que se prerenderizan todas. */
export function entries() {
	return REGIONES.map((region) => ({ region: region.slug }));
}

export function load({ params }: { params: { region: string } }) {
	const region = REGIONES.find((candidata) => candidata.slug === params.region);
	// Un slug inventado debe devolver 404 real, no una página vacía indexable.
	if (!region) error(404, 'Región no encontrada');
	return { region };
}
