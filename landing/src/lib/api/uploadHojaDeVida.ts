export type UploadHVResponse = {
	ok: boolean;
	data?: unknown;
	error?: string;
};

export async function uploadHojaDeVida(file: File): Promise<UploadHVResponse> {
	const API_URL = import.meta.env.VITE_API_URL as string | undefined;
	if (!API_URL) {
		return { ok: false, error: 'VITE_API_URL no está definida en el entorno' };
	}

	const endpoint = `${API_URL}/professionals/hv/upload`;

	const formData = new FormData();
	formData.append('file', file);

	try {
		const res = await fetch(endpoint, {
			method: 'POST',
			body: formData
		});

		const contentType = res.headers.get('content-type') || '';
		const payload = contentType.includes('application/json') ? await res.json() : await res.text();

		if (!res.ok) {
			return {
				ok: false,
				error: (payload as any)?.message || `Error ${res.status}: ${res.statusText}`
			};
		}

		console.log('Hoja de vida enviada con éxito:', payload);
		return { ok: true, data: payload };
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Error de red al enviar la hoja de vida';
		return { ok: false, error: message };
	}
}
