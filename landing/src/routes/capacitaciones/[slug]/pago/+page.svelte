<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { capacitaciones } from '$lib/data/capacitaciones';
	import { goto } from '$app/navigation';
	import { resolveRoute } from '$app/paths';

	// Obtener el curso por slug
	$: slug = $page.params.slug;
	$: curso = capacitaciones.find((c) => c.slug === slug);

	// Estado del formulario
	let metodoPago: 'tarjeta' | 'pse' | 'transferencia' = 'tarjeta';
	let procesando = false;
	let pagoExitoso = false;

	// Datos de facturación
	let nombre = '';
	let apellido = '';
	let email = '';
	let telefono = '';
	let documento = '';
	let ciudad = '';

	// Datos de tarjeta
	let numeroTarjeta = '';
	let nombreTarjeta = '';
	let vencimiento = '';
	let cvv = '';

	// Datos PSE
	let bancoSeleccionado = '';
	let tipoPersona: 'natural' | 'juridica' = 'natural';

	const bancos = [
		'Bancolombia',
		'Banco de Bogotá',
		'Davivienda',
		'BBVA Colombia',
		'Banco de Occidente',
		'Banco Popular',
		'Colpatria',
		'Banco AV Villas',
		'Scotiabank Colpatria'
	];

	// Función para formatear precio
	function formatearPrecio(precio: number): string {
		return new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			minimumFractionDigits: 0
		}).format(precio);
	}

	// Validar formulario
	function validarFormulario(): boolean {
		if (!nombre || !apellido || !email || !telefono || !documento || !ciudad) {
			alert('Por favor completa todos los datos de facturación');
			return false;
		}

		if (metodoPago === 'tarjeta') {
			if (!numeroTarjeta || !nombreTarjeta || !vencimiento || !cvv) {
				alert('Por favor completa todos los datos de la tarjeta');
				return false;
			}
			if (numeroTarjeta.replace(/\s/g, '').length !== 16) {
				alert('El número de tarjeta debe tener 16 dígitos');
				return false;
			}
			if (cvv.length !== 3) {
				alert('El CVV debe tener 3 dígitos');
				return false;
			}
		}

		if (metodoPago === 'pse' && !bancoSeleccionado) {
			alert('Por favor selecciona un banco');
			return false;
		}

		return true;
	}

	// Procesar pago
	async function procesarPago() {
		if (!validarFormulario()) return;

		procesando = true;

		// Simular procesamiento de pago (2 segundos)
		await new Promise((resolve) => setTimeout(resolve, 2000));

		procesando = false;
		pagoExitoso = true;

		// Redirigir a confirmación después de 2 segundos
		setTimeout(() => {
			goto(resolveRoute('/capacitaciones'));
		}, 3000);
	} // Formatear número de tarjeta
	function formatearNumeroTarjeta(valor: string) {
		const limpio = valor.replace(/\s/g, '');
		const grupos = limpio.match(/.{1,4}/g);
		numeroTarjeta = grupos ? grupos.join(' ') : limpio;
	}

	// Formatear vencimiento
	function formatearVencimiento(valor: string) {
		const limpio = valor.replace(/\D/g, '');
		if (limpio.length >= 2) {
			vencimiento = limpio.slice(0, 2) + '/' + limpio.slice(2, 4);
		} else {
			vencimiento = limpio;
		}
	}

	// Si no existe el curso, redireccionar
	$: if (!curso) {
		if (typeof window !== 'undefined') {
			window.location.href = '/capacitaciones';
		}
	}

	// Calcular precio final
	$: precioFinal = curso?.precioDescuento || curso?.precio || 0;
</script>

<svelte:head>
	{#if curso}
		<title>Pago - {curso.titulo} - SEGISPRO</title>
	{/if}
</svelte:head>

{#if curso}
	<main class="min-h-screen bg-linear-to-b from-gray-50 to-white py-12">
		<!-- Breadcrumb -->
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<nav class="mb-8 flex items-center gap-2 text-sm" in:fade>
				<a href={resolveRoute('/')} class="text-gray-500 transition-colors hover:text-blue-600"
					>Inicio</a
				>
				<span class="text-gray-400">/</span>
				<a
					href={resolveRoute('/capacitaciones')}
					class="text-gray-500 transition-colors hover:text-blue-600"
				>
					Capacitaciones
				</a>
				<span class="text-gray-400">/</span>
				<a
					href={resolveRoute(`/capacitaciones/${curso.slug}`)}
					class="text-gray-500 transition-colors hover:text-blue-600"
				>
					{curso.titulo}
				</a>
				<span class="text-gray-400">/</span>
				<span class="font-medium text-gray-900">Pago</span>
			</nav>

			<!-- Modal de éxito -->
			{#if pagoExitoso}
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" in:fade>
					<div
						class="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
						in:scale={{ duration: 500, easing: quintOut }}
					>
						<div
							class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
						>
							<svg
								class="h-10 w-10 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<h2 class="mb-2 text-2xl font-bold text-gray-900">¡Pago exitoso!</h2>
						<p class="mb-6 text-gray-600">
							Tu inscripción al curso ha sido confirmada. Recibirás un correo con los detalles de
							acceso.
						</p>
						<div class="rounded-lg bg-blue-50 p-4">
							<p class="text-sm font-semibold text-blue-900">Información importante:</p>
							<p class="mt-2 text-sm text-blue-700">
								Te hemos enviado un email a <strong>{email}</strong> con las instrucciones para acceder
								al curso.
							</p>
						</div>
					</div>
				</div>
			{/if}

			<div class="grid gap-8 lg:grid-cols-3">
				<!-- Formulario de pago -->
				<div class="lg:col-span-2">
					<div class="rounded-2xl bg-white p-6 shadow-lg md:p-8" in:fly={{ y: 30, duration: 600 }}>
						<h1 class="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">Checkout</h1>

						<form on:submit|preventDefault={procesarPago} class="space-y-8">
							<!-- Datos de facturación -->
							<div>
								<h2 class="mb-4 text-xl font-bold text-gray-900">Datos de facturación</h2>
								<div class="grid gap-4 md:grid-cols-2">
									<div>
										<label for="nombre" class="mb-2 block text-sm font-semibold text-gray-700">
											Nombre *
										</label>
										<input
											id="nombre"
											type="text"
											bind:value={nombre}
											required
											class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
											placeholder="Juan"
										/>
									</div>

									<div>
										<label for="apellido" class="mb-2 block text-sm font-semibold text-gray-700">
											Apellido *
										</label>
										<input
											id="apellido"
											type="text"
											bind:value={apellido}
											required
											class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
											placeholder="Pérez"
										/>
									</div>

									<div>
										<label for="email" class="mb-2 block text-sm font-semibold text-gray-700">
											Email *
										</label>
										<input
											id="email"
											type="email"
											bind:value={email}
											required
											class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
											placeholder="juan.perez@email.com"
										/>
									</div>

									<div>
										<label for="telefono" class="mb-2 block text-sm font-semibold text-gray-700">
											Teléfono *
										</label>
										<input
											id="telefono"
											type="tel"
											bind:value={telefono}
											required
											class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
											placeholder="300 123 4567"
										/>
									</div>

									<div>
										<label for="documento" class="mb-2 block text-sm font-semibold text-gray-700">
											Documento *
										</label>
										<input
											id="documento"
											type="text"
											bind:value={documento}
											required
											class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
											placeholder="1234567890"
										/>
									</div>

									<div>
										<label for="ciudad" class="mb-2 block text-sm font-semibold text-gray-700">
											Ciudad *
										</label>
										<input
											id="ciudad"
											type="text"
											bind:value={ciudad}
											required
											class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
											placeholder="Bogotá"
										/>
									</div>
								</div>
							</div>

							<!-- Método de pago -->
							<div>
								<h2 class="mb-4 text-xl font-bold text-gray-900">Método de pago</h2>

								<!-- Selector de método -->
								<div class="mb-6 grid gap-4 md:grid-cols-3">
									<button
										type="button"
										on:click={() => (metodoPago = 'tarjeta')}
										class="rounded-lg border-2 p-4 transition-all {metodoPago === 'tarjeta'
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300'}"
									>
										<svg
											class="mx-auto mb-2 h-8 w-8 {metodoPago === 'tarjeta'
												? 'text-blue-600'
												: 'text-gray-400'}"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
											/>
										</svg>
										<span
											class="font-semibold {metodoPago === 'tarjeta'
												? 'text-blue-900'
												: 'text-gray-700'}"
										>
											Tarjeta
										</span>
									</button>

									<button
										type="button"
										on:click={() => (metodoPago = 'pse')}
										class="rounded-lg border-2 p-4 transition-all {metodoPago === 'pse'
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300'}"
									>
										<svg
											class="mx-auto mb-2 h-8 w-8 {metodoPago === 'pse'
												? 'text-blue-600'
												: 'text-gray-400'}"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
											/>
										</svg>
										<span
											class="font-semibold {metodoPago === 'pse'
												? 'text-blue-900'
												: 'text-gray-700'}"
										>
											PSE
										</span>
									</button>

									<button
										type="button"
										on:click={() => (metodoPago = 'transferencia')}
										class="rounded-lg border-2 p-4 transition-all {metodoPago === 'transferencia'
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300'}"
									>
										<svg
											class="mx-auto mb-2 h-8 w-8 {metodoPago === 'transferencia'
												? 'text-blue-600'
												: 'text-gray-400'}"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<span
											class="font-semibold {metodoPago === 'transferencia'
												? 'text-blue-900'
												: 'text-gray-700'}"
										>
											Transferencia
										</span>
									</button>
								</div>

								<!-- Formulario de tarjeta -->
								{#if metodoPago === 'tarjeta'}
									<div class="space-y-4" in:fade>
										<div>
											<label
												for="numero-tarjeta"
												class="mb-2 block text-sm font-semibold text-gray-700"
											>
												Número de tarjeta *
											</label>
											<input
												id="numero-tarjeta"
												type="text"
												bind:value={numeroTarjeta}
												on:input={(e) => formatearNumeroTarjeta(e.currentTarget.value)}
												maxlength="19"
												required
												class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
												placeholder="1234 5678 9012 3456"
											/>
										</div>

										<div>
											<label
												for="nombre-tarjeta"
												class="mb-2 block text-sm font-semibold text-gray-700"
											>
												Nombre en la tarjeta *
											</label>
											<input
												id="nombre-tarjeta"
												type="text"
												bind:value={nombreTarjeta}
												required
												class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 uppercase transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
												placeholder="JUAN PEREZ"
											/>
										</div>

										<div class="grid gap-4 md:grid-cols-2">
											<div>
												<label
													for="vencimiento"
													class="mb-2 block text-sm font-semibold text-gray-700"
												>
													Vencimiento *
												</label>
												<input
													id="vencimiento"
													type="text"
													bind:value={vencimiento}
													on:input={(e) => formatearVencimiento(e.currentTarget.value)}
													maxlength="5"
													required
													class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
													placeholder="MM/AA"
												/>
											</div>

											<div>
												<label for="cvv" class="mb-2 block text-sm font-semibold text-gray-700">
													CVV *
												</label>
												<input
													id="cvv"
													type="text"
													bind:value={cvv}
													maxlength="3"
													required
													class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
													placeholder="123"
												/>
											</div>
										</div>
									</div>
								{/if}

								<!-- Formulario PSE -->
								{#if metodoPago === 'pse'}
									<div class="space-y-4" in:fade>
										<div>
											<label
												for="tipo-persona"
												class="mb-2 block text-sm font-semibold text-gray-700"
											>
												Tipo de persona *
											</label>
											<select
												id="tipo-persona"
												bind:value={tipoPersona}
												class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
											>
												<option value="natural">Persona Natural</option>
												<option value="juridica">Persona Jurídica</option>
											</select>
										</div>

										<div>
											<label for="banco" class="mb-2 block text-sm font-semibold text-gray-700">
												Selecciona tu banco *
											</label>
											<select
												id="banco"
												bind:value={bancoSeleccionado}
												required
												class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
											>
												<option value="">Selecciona un banco</option>
												{#each bancos as banco (banco)}
													<option value={banco}>{banco}</option>
												{/each}
											</select>
										</div>
									</div>
								{/if}

								<!-- Transferencia -->
								{#if metodoPago === 'transferencia'}
									<div class="rounded-lg bg-blue-50 p-6" in:fade>
										<h3 class="mb-4 font-bold text-blue-900">Datos para transferencia</h3>
										<div class="space-y-2 text-sm text-blue-800">
											<p><strong>Banco:</strong> Bancolombia</p>
											<p><strong>Tipo de cuenta:</strong> Ahorros</p>
											<p><strong>Número de cuenta:</strong> 1234-5678-9012</p>
											<p><strong>Titular:</strong> SEGISPRO SAS</p>
											<p><strong>NIT:</strong> 900.123.456-7</p>
										</div>
										<div class="mt-4 rounded-lg bg-yellow-100 p-4">
											<p class="text-sm font-semibold text-yellow-900">
												⚠️ Después de realizar la transferencia, envía el comprobante al correo
												pagos@segispro.com con tu número de documento.
											</p>
										</div>
									</div>
								{/if}
							</div>

							<!-- Botón de pago -->
							<button
								type="submit"
								disabled={procesando}
								class="w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-800 py-4 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
							>
								{#if procesando}
									<span class="flex items-center justify-center gap-2">
										<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											/>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										Procesando...
									</span>
								{:else}
									Completar pago ({formatearPrecio(precioFinal)})
								{/if}
							</button>

							<!-- Seguridad -->
							<div class="flex items-center justify-center gap-2 text-sm text-gray-500">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
								Pago seguro y encriptado
							</div>
						</form>
					</div>
				</div>

				<!-- Resumen de la orden -->
				<div class="lg:col-span-1">
					<div
						class="sticky top-4 rounded-2xl bg-white p-6 shadow-lg"
						in:fly={{ y: 30, duration: 600, delay: 200 }}
					>
						<h2 class="mb-4 text-xl font-bold text-gray-900">Resumen del pedido</h2>

						<!-- Curso -->
						<div class="mb-4 rounded-lg border border-gray-200 p-4">
							<h3 class="mb-2 font-bold text-gray-900">{curso.titulo}</h3>
							<div class="flex items-center gap-2 text-sm text-gray-600">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>{curso.duracion}</span>
							</div>
							<div class="mt-2 flex items-center gap-2 text-sm text-gray-600">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								<span>{curso.instructor}</span>
							</div>
						</div>

						<!-- Desglose de precios -->
						<div class="space-y-3 border-t pt-4">
							<div class="flex items-center justify-between text-gray-700">
								<span>Subtotal</span>
								<span>{formatearPrecio(curso.precio)}</span>
							</div>

							{#if curso.precioDescuento}
								<div class="flex items-center justify-between text-green-600">
									<span>Descuento</span>
									<span>-{formatearPrecio(curso.precio - curso.precioDescuento)}</span>
								</div>
							{/if}

							<div class="border-t pt-3">
								<div class="flex items-center justify-between text-xl font-bold text-gray-900">
									<span>Total</span>
									<span>{formatearPrecio(precioFinal)}</span>
								</div>
							</div>
						</div>

						<!-- Garantía -->
						<div class="mt-6 rounded-lg bg-green-50 p-4">
							<div class="flex items-start gap-3">
								<svg
									class="h-6 w-6 shrink-0 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
								<div>
									<h3 class="font-bold text-green-900">Garantía de 30 días</h3>
									<p class="text-sm text-green-700">
										Si no estás satisfecho, te devolvemos tu dinero
									</p>
								</div>
							</div>
						</div>

						<!-- Incluye -->
						<div class="mt-6 space-y-2">
							<h3 class="font-bold text-gray-900">Incluye:</h3>
							<div class="flex items-center gap-2 text-sm text-gray-700">
								<svg class="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								Acceso de por vida
							</div>
							{#if curso.certificacion}
								<div class="flex items-center gap-2 text-sm text-gray-700">
									<svg class="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									Certificado de finalización
								</div>
							{/if}
							<div class="flex items-center gap-2 text-sm text-gray-700">
								<svg class="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								Material descargable
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
{/if}
