import { json } from '@sveltejs/kit';
import { buscarCertificadoPorUUID, validarFormatoUUID } from '$lib/data/certificados';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const uuid = url.searchParams.get('uuid');

	// Validar que se proporcionó un UUID
	if (!uuid) {
		return json(
			{
				success: false,
				error: 'Debe proporcionar un código UUID para validar'
			},
			{ status: 400 }
		);
	}

	// Validar formato del UUID
	if (!validarFormatoUUID(uuid)) {
		return json(
			{
				success: false,
				error: 'El formato del código UUID no es válido'
			},
			{ status: 400 }
		);
	}

	// Buscar el certificado
	const certificado = buscarCertificadoPorUUID(uuid);

	if (!certificado) {
		return json(
			{
				success: false,
				error: 'No se encontró ningún certificado con este código'
			},
			{ status: 404 }
		);
	}

	// Retornar certificado encontrado
	return json(
		{
			success: true,
			certificado
		},
		{
			status: 200,
			headers: {
				'Cache-Control': 'public, max-age=300' // Cache por 5 minutos
			}
		}
	);
};
