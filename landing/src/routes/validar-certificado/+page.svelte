<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Certificado } from '$lib/data/certificados';

	let mounted = false;
	let uuid = '';
	let loading = false;
	let certificado: Certificado | null = null;
	let error: string | null = null;
	let validado = false;

	onMount(() => {
		mounted = true;
	});

	async function validarCertificado() {
		if (!uuid.trim()) {
			error = 'Por favor, ingresa un código UUID válido';
			return;
		}

		loading = true;
		error = null;
		certificado = null;
		validado = false;

		try {
			const response = await fetch(`/api/validar-certificado?uuid=${encodeURIComponent(uuid)}`);
			const data = await response.json();

			if (data.success) {
				certificado = data.certificado;
				validado = true;
			} else {
				error = data.error || 'No se pudo validar el certificado';
			}
		} catch (err) {
			error = 'Error de conexión. Por favor, intenta nuevamente.';
			console.error('Error validando certificado:', err);
		} finally {
			loading = false;
		}
	}

	function limpiarFormulario() {
		uuid = '';
		certificado = null;
		error = null;
		validado = false;
	}

	function copiarUUID(text: string) {
		navigator.clipboard.writeText(text);
	}
</script>

<svelte:head>
	<title>Validar Certificado - SEGISPRO</title>
	<meta
		name="description"
		content="Valida la autenticidad de tu certificado emitido por SEGISPRO mediante su código UUID único."
	/>
	<meta name="robots" content="index, follow" />
</svelte:head>

<!-- Header Simple -->
<header class="fixed left-0 right-0 top-0 z-50 bg-white shadow-md">
	<nav class="container mx-auto px-4 py-4 sm:px-6">
		<div class="flex items-center justify-between">
			<a href="/" class="group flex items-center">
				<img
					src="/assets/logo.png"
					alt="SEGISPRO Logo"
					class="h-8 w-32 transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-36"
				/>
			</a>
			<a
				href="/"
				class="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Volver al inicio
			</a>
		</div>
	</nav>
</header>

<!-- Main Content -->
<main class="bg-linear-to-br min-h-screen from-white via-gray-50 to-blue-50 px-6 pb-20 pt-32">
	<div class="container mx-auto max-w-4xl">
		{#if mounted}
			<!-- Header -->
			<div in:fly={{ y: 30, duration: 600 }} class="mb-12 text-center">
				<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
					<svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span class="text-sm font-semibold text-blue-600">Verificación</span>
				</div>
				<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
					Validar <span class="text-blue-600">Certificado</span>
				</h1>
				<p class="mx-auto max-w-2xl text-lg text-gray-600">
					Ingresa el código UUID de tu certificado para verificar su autenticidad y obtener los
					detalles completos.
				</p>
				<div class="bg-linear-to-r mx-auto mt-6 h-1.5 w-24 rounded-full from-blue-600 to-orange-600">
				</div>
			</div>

			<!-- Formulario de Validación -->
			<div
				in:fly={{ y: 30, duration: 800, delay: 200 }}
				class="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl"
			>
				<div class="p-8 md:p-12">
					<h2 class="mb-6 text-2xl font-bold text-gray-900">Ingresa el código UUID</h2>

					<form on:submit|preventDefault={validarCertificado} class="space-y-6">
						<div>
							<label for="uuid" class="mb-2 block text-sm font-semibold text-gray-700">
								Código UUID del certificado
							</label>
							<input
								id="uuid"
								type="text"
								bind:value={uuid}
								placeholder="Ej: a1b2c3d4-e5f6-7890-abcd-ef1234567890"
								class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 font-mono text-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
								disabled={loading}
							/>
							<p class="mt-2 text-sm text-gray-500">
								El código UUID se encuentra en la parte inferior de tu certificado físico o digital.
							</p>
						</div>

						{#if error}
							<div
								in:scale={{ duration: 300 }}
								class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4"
							>
								<svg
									class="h-5 w-5 shrink-0 text-red-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<div>
									<h3 class="font-semibold text-red-800">Error de validación</h3>
									<p class="text-sm text-red-600">{error}</p>
								</div>
							</div>
						{/if}

						<div class="flex gap-3">
							<button
								type="submit"
								disabled={loading || !uuid.trim()}
								class="bg-linear-to-r flex-1 transform rounded-lg from-blue-600 to-blue-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
							>
								{#if loading}
									<span class="flex items-center justify-center gap-2">
										<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Validando...
									</span>
								{:else}
									<span class="flex items-center justify-center gap-2">
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Validar certificado
									</span>
								{/if}
							</button>

							{#if certificado || error}
								<button
									type="button"
									on:click={limpiarFormulario}
									class="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50"
								>
									Limpiar
								</button>
							{/if}
						</div>
					</form>

					<!-- Ejemplos de UUIDs para testing -->
					<div class="mt-8 rounded-lg bg-blue-50 p-4">
						<h3 class="mb-3 text-sm font-semibold text-blue-900">
							Códigos de ejemplo para probar:
						</h3>
						<div class="grid gap-2 sm:grid-cols-2">
							{#each ['a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'd4e5f6a7-b8c9-0123-def1-234567890123'] as exampleUuid}
								<button
									type="button"
									on:click={() => {
										uuid = exampleUuid;
									}}
									class="group flex items-center gap-2 rounded-lg bg-white p-2 text-left text-xs font-mono text-gray-700 transition-all hover:bg-blue-100 hover:text-blue-700"
								>
									<svg
										class="h-4 w-4 shrink-0 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
										/>
									</svg>
									<span class="truncate">{exampleUuid}</span>
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Resultado de Validación -->
			{#if validado && certificado}
				<div in:fly={{ y: 30, duration: 800 }} class="space-y-8">
					<!-- Badge de Validación Exitosa -->
					<div
						in:scale={{ duration: 600, delay: 200 }}
						class="overflow-hidden rounded-3xl border-2 border-green-200 bg-linear-to-br from-green-50 to-emerald-50 shadow-xl"
					>
						<div class="p-8 text-center">
							<div class="mb-4 inline-flex items-center justify-center">
								<div
									class="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-green-500 to-emerald-600 shadow-lg"
								>
									<svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
							</div>
							<h2 class="mb-2 text-3xl font-bold text-green-800">¡Certificado Válido!</h2>
							<p class="text-lg text-green-700">
								Este certificado ha sido emitido por SEGISPRO y es auténtico.
							</p>
						</div>
					</div>

					<!-- Detalles del Certificado -->
					<div
						in:fly={{ y: 30, duration: 800, delay: 300 }}
						class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl"
					>
						<div class="border-b border-gray-200 bg-linear-to-r from-blue-600 to-blue-500 p-6">
							<h3 class="text-2xl font-bold text-white">Información del Certificado</h3>
						</div>

						<div class="p-8">
							<div class="grid gap-6 md:grid-cols-2">
								<!-- Nombre -->
								<div class="md:col-span-2">
									<label class="mb-2 block text-sm font-semibold text-gray-600">
										Nombre del participante
									</label>
									<p class="text-xl font-bold text-gray-900">{certificado.nombre}</p>
								</div>

								<!-- Identificación -->
								<div>
									<label class="mb-2 block text-sm font-semibold text-gray-600">
										Documento de identidad
									</label>
									<p class="text-lg text-gray-900">{certificado.identificacion}</p>
								</div>

								<!-- Código -->
								<div>
									<label class="mb-2 block text-sm font-semibold text-gray-600">
										Código del certificado
									</label>
									<p class="font-mono text-lg text-gray-900">{certificado.codigo}</p>
								</div>

								<!-- Curso -->
								<div class="md:col-span-2">
									<label class="mb-2 block text-sm font-semibold text-gray-600">
										Curso o programa
									</label>
									<p class="text-lg font-semibold text-blue-600">{certificado.curso}</p>
								</div>

								<!-- Duración -->
								<div>
									<label class="mb-2 block text-sm font-semibold text-gray-600"> Duración </label>
									<p class="text-lg text-gray-900">{certificado.duracion}</p>
								</div>

								<!-- Instructor -->
								<div>
									<label class="mb-2 block text-sm font-semibold text-gray-600"> Instructor </label>
									<p class="text-lg text-gray-900">{certificado.instructor}</p>
								</div>

								<!-- Fecha de emisión -->
								<div>
									<label class="mb-2 block text-sm font-semibold text-gray-600">
										Fecha de emisión
									</label>
									<p class="text-lg text-gray-900">{certificado.fechaEmision}</p>
								</div>

								<!-- Fecha de vencimiento -->
								<div>
									<label class="mb-2 block text-sm font-semibold text-gray-600">
										Válido hasta
									</label>
									<p class="text-lg text-gray-900">{certificado.fechaVencimiento}</p>
								</div>

								<!-- Notas -->
								{#if certificado.notas}
									<div class="md:col-span-2">
										<label class="mb-2 block text-sm font-semibold text-gray-600">
											Observaciones
										</label>
										<p class="text-lg text-gray-900">{certificado.notas}</p>
									</div>
								{/if}

								<!-- UUID -->
								<div class="md:col-span-2">
									<label class="mb-2 block text-sm font-semibold text-gray-600">
										Código UUID (único e irrepetible)
									</label>
									<div class="flex items-center gap-2">
										<p class="flex-1 rounded-lg bg-gray-100 px-4 py-2 font-mono text-sm text-gray-700">
											{certificado.uuid}
										</p>
										<button
											type="button"
											on:click={() => copiarUUID(certificado.uuid)}
											class="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
											title="Copiar UUID"
										>
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Certificado Visual -->
					<div
						in:scale={{ duration: 800, delay: 400 }}
						class="overflow-hidden rounded-3xl border-4 border-blue-600 bg-white shadow-2xl"
					>
						<!-- Encabezado del certificado -->
						<div class="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 p-8 text-white">
							<!-- Patrón de fondo -->
							<div class="absolute inset-0 opacity-10">
								<div
									class="absolute inset-0"
									style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 30px 30px;"
								></div>
							</div>

							<div class="relative z-10 text-center">
								<img src="/assets/logo-white.png" alt="SEGISPRO" class="mx-auto mb-4 h-12" />
								<h2 class="mb-2 text-3xl font-bold">SEGISPRO INGENIERÍA SAS</h2>
								<p class="text-lg opacity-90">Certificado de Formación Profesional</p>
							</div>
						</div>

						<!-- Cuerpo del certificado -->
						<div class="p-12">
							<div class="mb-8 text-center">
								<p class="mb-4 text-lg text-gray-600">Se certifica que</p>
								<h3 class="mb-6 text-4xl font-bold text-gray-900">{certificado.nombre}</h3>
								<p class="mb-2 text-lg text-gray-600">identificado(a) con documento N°</p>
								<p class="mb-6 text-2xl font-semibold text-gray-800">{certificado.identificacion}</p>
								<p class="mb-4 text-lg text-gray-600">Ha completado satisfactoriamente el programa</p>
								<h4 class="mb-8 text-3xl font-bold text-blue-600">{certificado.curso}</h4>
								<p class="text-lg text-gray-600">
									con una intensidad horaria de <span class="font-semibold text-gray-900"
										>{certificado.duracion}</span
									>
								</p>
							</div>

							<!-- Firmas -->
							<div class="mt-12 grid grid-cols-2 gap-8 border-t border-gray-200 pt-8">
								<div class="text-center">
									<div class="mb-4 border-b-2 border-gray-400 pb-2">
										<p class="font-semibold text-gray-900">{certificado.instructor}</p>
									</div>
									<p class="text-sm text-gray-600">Instructor</p>
								</div>
								<div class="text-center">
									<div class="mb-4 border-b-2 border-gray-400 pb-2">
										<p class="font-semibold text-gray-900">Director Académico</p>
									</div>
									<p class="text-sm text-gray-600">SEGISPRO Ingeniería SAS</p>
								</div>
							</div>

							<!-- Información adicional -->
							<div class="mt-8 rounded-lg bg-gray-50 p-6 text-center">
								<div class="mb-4 grid grid-cols-2 gap-4 text-sm">
									<div>
										<p class="font-semibold text-gray-700">Fecha de emisión:</p>
										<p class="text-gray-600">{certificado.fechaEmision}</p>
									</div>
									<div>
										<p class="font-semibold text-gray-700">Válido hasta:</p>
										<p class="text-gray-600">{certificado.fechaVencimiento}</p>
									</div>
								</div>
								<div class="border-t border-gray-300 pt-4">
									<p class="mb-2 text-xs font-semibold text-gray-700">Código de verificación:</p>
									<p class="font-mono text-xs text-gray-600">{certificado.codigo}</p>
									<p class="mb-2 mt-2 text-xs font-semibold text-gray-700">UUID:</p>
									<p class="break-all font-mono text-xs text-gray-600">{certificado.uuid}</p>
								</div>
								<p class="mt-4 text-xs text-gray-500">
									Válido en www.segispro.com/validar-certificado
								</p>
							</div>

							<!-- Sello oficial -->
							<div class="mt-8 flex justify-center">
								<div
									class="flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-600 bg-blue-50"
								>
									<svg class="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>

					<!-- Botón para descargar o imprimir -->
					<div class="flex justify-center gap-4">
						<button
							type="button"
							on:click={() => window.print()}
							class="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-gray-900 hover:shadow-lg"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
								/>
							</svg>
							Imprimir certificado
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</main>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	@media print {
		header,
		form,
		button {
			display: none !important;
		}
	}
</style>
