import { error } from '@sveltejs/kit';
import { capacitaciones } from '$lib/data/capacitaciones';

export const prerender = true;

export function entries() {
	return capacitaciones.map((curso) => ({ slug: curso.slug }));
}

export function load({ params }: { params: { slug: string } }) {
	const curso = capacitaciones.find((candidato) => candidato.slug === params.slug);
	// Antes se hacía `window.location.href = '/capacitaciones'`: para el rastreador
	// eso es una página 200 vacía, no una redirección ni un 404.
	if (!curso) error(404, 'Capacitación no encontrada');
	return { curso };
}
