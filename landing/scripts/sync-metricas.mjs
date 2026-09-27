#!/usr/bin/env node
/**
 * Congela los agregados del backend en `src/lib/data/metricas.json`.
 *
 * La landing es estática y se prerenderiza: si consultara la API en cada carga
 * habría que volver dinámicas las páginas, exponer el endpoint al público y
 * añadir latencia al primer render. Con el snapshot el sitio no depende de la
 * API en tiempo de ejecución, y si la API se cae sigue mostrando la última
 * cifra buena.
 *
 * Uso:
 *   node scripts/sync-metricas.mjs
 *   API_STATS_URL=http://localhost:3001/api/public/stats node scripts/sync-metricas.mjs
 */
import { writeFile, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destino = resolve(raiz, 'src/lib/data/metricas.json');

const url = process.env.API_STATS_URL ?? 'http://localhost:3001/api/public/stats';
const TIEMPO_LIMITE_MS = 20_000;

/** Campos sin los cuales el JSON no sirve para pintar nada. */
const OBLIGATORIOS = ['serviciosPrestados', 'clientesAtendidos', 'aniosOperacion', 'porCategoria'];

function validar(datos) {
	for (const campo of OBLIGATORIOS) {
		if (datos[campo] === undefined) throw new Error(`Falta el campo "${campo}" en la respuesta`);
	}
	if (!Array.isArray(datos.porCategoria)) {
		throw new Error('"porCategoria" debería ser una lista');
	}
	// Un cero casi siempre significa que la consulta se rompió, no que no haya
	// actividad: preferimos conservar el snapshot anterior antes que publicarlo.
	if (datos.serviciosPrestados <= 0 || datos.clientesAtendidos <= 0) {
		throw new Error(
			`Cifras en cero (servicios ${datos.serviciosPrestados}, clientes ${datos.clientesAtendidos})`
		);
	}
}

async function anterior() {
	try {
		return JSON.parse(await readFile(destino, 'utf8'));
	} catch {
		return null;
	}
}

const reloj = AbortSignal.timeout(TIEMPO_LIMITE_MS);

try {
	const respuesta = await fetch(url, { signal: reloj, headers: { accept: 'application/json' } });
	if (!respuesta.ok) throw new Error(`${respuesta.status} ${respuesta.statusText}`);

	const datos = await respuesta.json();
	validar(datos);

	const previo = await anterior();
	await writeFile(destino, `${JSON.stringify(datos, null, '\t')}\n`, 'utf8');

	const delta = previo ? datos.serviciosPrestados - previo.serviciosPrestados : null;
	console.log(
		`✓ ${datos.serviciosPrestados} servicios · ${datos.clientesAtendidos} clientes · ` +
			`${datos.porCategoria.length} categorías` +
			(delta === null ? '' : ` (${delta >= 0 ? '+' : ''}${delta} desde el snapshot anterior)`)
	);
} catch (error) {
	// Fallar aquí no debe romper un despliegue: el snapshot que ya está
	// versionado sigue siendo válido.
	console.error(`✗ No se pudo sincronizar desde ${url}: ${error.message}`);
	const previo = await anterior();
	if (previo) {
		console.error(`  Se conserva el snapshot del ${previo.calculadoEn}.`);
		process.exit(0);
	}
	console.error('  No hay snapshot previo que conservar.');
	process.exit(1);
}
