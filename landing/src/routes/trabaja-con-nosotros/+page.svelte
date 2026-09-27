<script lang="ts">
	import { resolve } from '$app/paths';
	import Seo from '$lib/seo/Seo.svelte';
	import { absoluteUrl, REGIONES } from '$lib/seo/site';
	import {
		breadcrumbSchema,
		faqSchema,
		graph,
		organizationSchema,
		webPageSchema,
		websiteSchema
	} from '$lib/seo/schema';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageFooter from '$lib/components/PageFooter.svelte';
	import { enviarPostulacion } from '$lib/api/postulacion';
	import { obtenerTokenCaptcha, precargarCaptcha } from '$lib/recaptcha';
	import metricas from '$lib/data/metricas.json';
	import { AREAS, PASOS, PERFILES, PREGUNTAS } from './datos';

	const title = 'Trabaja con nosotros | Auditores, capacitadores y consultores SST | SEGISPRO';
	const description =
		'Postúlate a la red de profesionales de SEGISPRO: auditores internos ISO, capacitadores en seguridad y salud en el trabajo, consultores HSEQ y especialistas en estudios técnicos en Casanare, Meta, Boyacá, Bogotá y Cundinamarca.';

	const schema = graph([
		organizationSchema(),
		websiteSchema(),
		webPageSchema({ url: absoluteUrl('/trabaja-con-nosotros'), title, description }),
		breadcrumbSchema([{ name: 'Trabaja con nosotros', path: '/trabaja-con-nosotros' }]),
		faqSchema(PREGUNTAS)
	]);

	const regiones = REGIONES.map((region) => region.nombre).join(', ');

	// ── Formulario ────────────────────────────────────────────────────────────
	let nombre = $state('');
	let correo = $state('');
	let telefono = $state('');
	let ciudad = $state('');
	let areaInteres = $state('');
	let aniosExperiencia = $state('');
	let mensaje = $state('');
	let archivo: File | null = $state(null);
	let aceptaPolitica = $state(false);

	let enviando = $state(false);
	let exito = $state<string | null>(null);
	let errores = $state<string[]>([]);

	const TAMANIO_MAXIMO = 8 * 1024 * 1024;
	const EXTENSIONES = ['.pdf', '.doc', '.docx'];

	function elegirArchivo(evento: Event) {
		const entrada = evento.target as HTMLInputElement;
		const elegido = entrada.files?.[0] ?? null;
		errores = [];

		if (!elegido) {
			archivo = null;
			return;
		}

		// El backend valida por bytes de cabecera; esto es solo para avisar antes
		// de gastar una subida y una petición del límite de tasa.
		const extension = elegido.name.slice(elegido.name.lastIndexOf('.')).toLowerCase();
		if (!EXTENSIONES.includes(extension)) {
			errores = ['Tu hoja de vida debe ir en PDF, DOC o DOCX.'];
			archivo = null;
			entrada.value = '';
			return;
		}

		if (elegido.size > TAMANIO_MAXIMO) {
			errores = [`El archivo pesa ${(elegido.size / 1048576).toFixed(1)} MB y el máximo son 8 MB.`];
			archivo = null;
			entrada.value = '';
			return;
		}

		archivo = elegido;
	}

	async function enviar(evento: SubmitEvent) {
		evento.preventDefault();
		errores = [];

		if (!archivo) {
			errores = ['Adjunta tu hoja de vida.'];
			return;
		}
		if (!aceptaPolitica) {
			errores = ['Debes autorizar el tratamiento de tus datos personales.'];
			return;
		}

		enviando = true;
		const token = await obtenerTokenCaptcha('postulacion');
		const respuesta = await enviarPostulacion(
			{ nombre, correo, telefono, ciudad, areaInteres, aniosExperiencia, mensaje },
			archivo,
			token
		);
		enviando = false;

		if (respuesta.ok) {
			exito = respuesta.message;
			return;
		}
		errores = respuesta.errores;
	}
</script>

<Seo {title} {description} path="/trabaja-con-nosotros" {schema} />

<PageHeader />

<main class="min-h-screen bg-white pt-20">
	<section class="bg-linear-to-br from-gray-900 via-gray-800 to-black px-4 py-16 sm:px-6">
		<div class="container mx-auto max-w-5xl">
			<nav aria-label="Ruta de navegación" class="mb-6 text-sm text-gray-400">
				<a href={resolve('/')} class="hover:text-blue-400">Inicio</a>
				<span class="mx-2">/</span>
				<span class="text-white">Trabaja con nosotros</span>
			</nav>

			<p class="mb-3 text-sm font-semibold tracking-wide text-blue-400 uppercase">
				Red de profesionales
			</p>
			<h1 class="mb-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
				Trabaja con <span class="text-blue-400">SEGISPRO</span>
			</h1>
			<p class="max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">
				Buscamos auditores, capacitadores, consultores y especialistas en estudios técnicos para
				ejecutar servicios en {regiones}. La contratación es por actividad: cada servicio se pacta
				con su alcance, sus fechas y su tarifa.
			</p>

			<dl class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
				<div>
					<dt class="text-xs tracking-wide text-gray-400 uppercase">Profesionales</dt>
					<dd class="text-2xl font-bold text-white">{metricas.profesionales}</dd>
				</div>
				<div>
					<dt class="text-xs tracking-wide text-gray-400 uppercase">Servicios ejecutados</dt>
					<dd class="text-2xl font-bold text-white">
						{metricas.serviciosPrestados.toLocaleString('es-CO')}
					</dd>
				</div>
				<div>
					<dt class="text-xs tracking-wide text-gray-400 uppercase">Municipios</dt>
					<dd class="text-2xl font-bold text-white">{metricas.ciudadesAtendidas}</dd>
				</div>
				<div>
					<dt class="text-xs tracking-wide text-gray-400 uppercase">Años operando</dt>
					<dd class="text-2xl font-bold text-white">{metricas.aniosOperacion}</dd>
				</div>
			</dl>
		</div>
	</section>

	<section class="px-4 py-14 sm:px-6">
		<div class="container mx-auto max-w-5xl">
			<h2 class="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">Perfiles que contratamos</h2>
			<div class="grid gap-5 md:grid-cols-2">
				{#each PERFILES as perfil (perfil.titulo)}
					<article class="rounded-2xl border border-gray-200 bg-white p-6">
						<h3 class="mb-2 text-lg font-bold text-gray-900">{perfil.titulo}</h3>
						<p class="mb-4 text-sm leading-relaxed text-gray-600">{perfil.descripcion}</p>
						<ul class="space-y-2">
							{#each perfil.requisitos as requisito (requisito)}
								<li class="flex gap-2 text-sm text-gray-700">
									<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"></span>
									<span>{requisito}</span>
								</li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="px-4 py-14 sm:px-6">
		<div class="container mx-auto max-w-5xl">
			<h2 class="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">En qué se trabaja</h2>
			<p class="mb-8 max-w-3xl text-sm leading-relaxed text-gray-600">
				Reparto real de los {metricas.serviciosPrestados.toLocaleString('es-CO')} servicios ejecutados
				hasta hoy. Sirve para saber dónde hay volumen antes de postularse.
			</p>

			<ul class="space-y-3">
				{#each metricas.porCategoria as categoria (categoria.etiqueta)}
					{@const proporcion = Math.round((categoria.total / metricas.serviciosPrestados) * 100)}
					<li class="flex items-center gap-4">
						<span class="w-56 shrink-0 text-sm font-medium text-gray-900">{categoria.etiqueta}</span
						>
						<span class="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
							<span
								class="block h-full rounded-full bg-blue-600"
								style="width: {Math.max(proporcion, 1)}%"
							></span>
						</span>
						<span class="w-20 shrink-0 text-right text-sm text-gray-600 tabular-nums">
							{categoria.total.toLocaleString('es-CO')}
						</span>
					</li>
				{/each}
			</ul>

			<p class="mt-6 text-xs text-gray-500">
				Cifras tomadas del sistema de gestión de SEGISPRO; solo cuentan las actividades
				efectivamente ejecutadas.
			</p>
		</div>
	</section>

	<section class="bg-gray-50 px-4 py-14 sm:px-6">
		<div class="container mx-auto max-w-5xl">
			<h2 class="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">Cómo es el proceso</h2>
			<ol class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{#each PASOS as paso, i (paso.titulo)}
					<li class="rounded-2xl border border-gray-200 bg-white p-5">
						<span
							class="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
						>
							{i + 1}
						</span>
						<h3 class="mb-2 font-semibold text-gray-900">{paso.titulo}</h3>
						<p class="text-sm leading-relaxed text-gray-600">{paso.detalle}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section id="postular" class="px-4 py-14 sm:px-6">
		<div class="container mx-auto max-w-3xl">
			<h2 class="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">Envía tu hoja de vida</h2>
			<p class="mb-8 text-sm leading-relaxed text-gray-600">
				Los campos marcados con asterisco son obligatorios. El archivo puede ir en PDF, DOC o DOCX,
				hasta 8 MB.
			</p>

			{#if exito}
				<div
					class="rounded-2xl border border-green-200 bg-green-50 p-6"
					role="status"
					aria-live="polite"
				>
					<h3 class="mb-2 text-lg font-bold text-green-900">¡Listo!</h3>
					<p class="text-sm leading-relaxed text-green-800">{exito}</p>
				</div>
			{:else}
				<form
					class="space-y-5"
					onsubmit={enviar}
					onfocusin={precargarCaptcha}
					enctype="multipart/form-data"
				>
					{#if errores.length}
						<div
							class="rounded-xl border border-red-200 bg-red-50 p-4"
							role="alert"
							aria-live="assertive"
						>
							<ul class="space-y-1 text-sm text-red-800">
								{#each errores as error (error)}
									<li>{error}</li>
								{/each}
							</ul>
						</div>
					{/if}

					<div class="grid gap-5 sm:grid-cols-2">
						<div>
							<label for="nombre" class="mb-1.5 block text-sm font-medium text-gray-900">
								Nombre completo <span class="text-red-600" aria-hidden="true">*</span>
							</label>
							<input
								id="nombre"
								name="nombre"
								type="text"
								required
								minlength="3"
								maxlength="160"
								autocomplete="name"
								bind:value={nombre}
								class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label for="correo" class="mb-1.5 block text-sm font-medium text-gray-900">
								Correo electrónico <span class="text-red-600" aria-hidden="true">*</span>
							</label>
							<input
								id="correo"
								name="correo"
								type="email"
								required
								maxlength="160"
								autocomplete="email"
								bind:value={correo}
								class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label for="telefono" class="mb-1.5 block text-sm font-medium text-gray-900">
								Teléfono <span class="text-red-600" aria-hidden="true">*</span>
							</label>
							<input
								id="telefono"
								name="telefono"
								type="tel"
								required
								maxlength="40"
								autocomplete="tel"
								bind:value={telefono}
								class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label for="ciudad" class="mb-1.5 block text-sm font-medium text-gray-900">
								Ciudad
							</label>
							<input
								id="ciudad"
								name="ciudad"
								type="text"
								maxlength="120"
								autocomplete="address-level2"
								bind:value={ciudad}
								class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label for="area" class="mb-1.5 block text-sm font-medium text-gray-900">
								Área de interés
							</label>
							<select
								id="area"
								name="areaInteres"
								bind:value={areaInteres}
								class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							>
								<option value="">Selecciona una</option>
								{#each AREAS as area (area)}
									<option value={area}>{area}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="experiencia" class="mb-1.5 block text-sm font-medium text-gray-900">
								Años de experiencia
							</label>
							<input
								id="experiencia"
								name="aniosExperiencia"
								type="number"
								min="0"
								max="60"
								bind:value={aniosExperiencia}
								class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div>
						<label for="mensaje" class="mb-1.5 block text-sm font-medium text-gray-900">
							Cuéntanos sobre tu perfil
						</label>
						<textarea
							id="mensaje"
							name="mensaje"
							rows="4"
							maxlength="1000"
							bind:value={mensaje}
							class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						></textarea>
					</div>

					<div>
						<label for="archivo" class="mb-1.5 block text-sm font-medium text-gray-900">
							Hoja de vida <span class="text-red-600" aria-hidden="true">*</span>
						</label>
						<input
							id="archivo"
							name="file"
							type="file"
							required
							accept=".pdf,.doc,.docx"
							onchange={elegirArchivo}
							class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
						/>
						{#if archivo}
							<p class="mt-2 text-xs text-gray-500">
								{archivo.name} · {(archivo.size / 1024).toFixed(0)} KB
							</p>
						{/if}
					</div>

					<div class="flex items-start gap-3">
						<input
							id="politica"
							type="checkbox"
							required
							bind:checked={aceptaPolitica}
							class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<label for="politica" class="text-sm leading-relaxed text-gray-600">
							Autorizo el tratamiento de mis datos personales conforme a la
							<a
								href={resolve('/politicas-de-privacidad')}
								class="font-medium text-blue-700 underline">política de privacidad</a
							>, en los términos de la Ley 1581 de 2012.
						</label>
					</div>

					<button
						type="submit"
						disabled={enviando}
						class="w-full rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
					>
						{enviando ? 'Enviando…' : 'Enviar hoja de vida'}
					</button>

					<p class="text-xs leading-relaxed text-gray-500">
						Este sitio está protegido por reCAPTCHA; aplican la
						<a
							href="https://policies.google.com/privacy"
							target="_blank"
							rel="noopener"
							class="underline">política de privacidad</a
						>
						y los
						<a
							href="https://policies.google.com/terms"
							target="_blank"
							rel="noopener"
							class="underline">términos de servicio</a
						> de Google.
					</p>
				</form>
			{/if}
		</div>
	</section>

	<section class="bg-gray-50 px-4 py-14 sm:px-6">
		<div class="container mx-auto max-w-3xl">
			<h2 class="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">Preguntas frecuentes</h2>
			<dl class="space-y-4">
				{#each PREGUNTAS as item (item.pregunta)}
					<div class="rounded-2xl border border-gray-200 bg-white p-5">
						<dt class="mb-2 font-semibold text-gray-900">{item.pregunta}</dt>
						<dd class="text-sm leading-relaxed text-gray-600">{item.respuesta}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</section>
</main>

<PageFooter />
