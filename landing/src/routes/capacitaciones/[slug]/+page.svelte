<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { capacitaciones } from '$lib/data/capacitaciones';

	// Obtener el curso por slug
	$: slug = $page.params.slug;
	$: curso = capacitaciones.find((c) => c.slug === slug);

	// Estado para tabs
	let tabActivo: 'descripcion' | 'temario' | 'instructor' | 'resenas' = 'descripcion';

	// Función para formatear precio
	function formatearPrecio(precio: number): string {
		return new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			minimumFractionDigits: 0
		}).format(precio);
	}

	// Si no existe el curso, redireccionar
	$: if (!curso) {
		if (typeof window !== 'undefined') {
			window.location.href = '/capacitaciones';
		}
	}
</script>

<svelte:head>
	{#if curso}
		<title>{curso.titulo} - SEGISPRO Capacitaciones</title>
		<meta name="description" content={curso.descripcion} />
	{/if}
</svelte:head>

{#if curso}
	<main class="min-h-screen bg-linear-to-b from-gray-50 to-white">
		<!-- Breadcrumb -->
		<div class="border-b bg-white">
			<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
				<nav class="flex items-center gap-2 text-sm" in:fade>
					<a href="/" class="text-gray-500 transition-colors hover:text-blue-600">Inicio</a>
					<span class="text-gray-400">/</span>
					<a href="/capacitaciones" class="text-gray-500 transition-colors hover:text-blue-600">
						Capacitaciones
					</a>
					<span class="text-gray-400">/</span>
					<span class="font-medium text-gray-900">{curso.titulo}</span>
				</nav>
			</div>
		</div>

		<!-- Hero del curso -->
		<div class="bg-linear-to-r from-blue-900 to-blue-700 text-white">
			<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div class="grid gap-8 lg:grid-cols-3">
					<!-- Información principal -->
					<div class="lg:col-span-2" in:fly={{ y: -30, duration: 800, easing: quintOut }}>
						<!-- Badges -->
						<div class="mb-4 flex flex-wrap gap-2">
							<span
								class="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm"
							>
								{curso.categoria}
							</span>
							{#if curso.destacado}
								<span class="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold">
									⭐ Destacado
								</span>
							{/if}
							{#if curso.cupoLimitado}
								<span class="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold">
									🔥 Cupo limitado
								</span>
							{/if}
						</div>

						<h1 class="mb-4 text-4xl font-bold md:text-5xl">{curso.titulo}</h1>
						<p class="mb-6 text-lg opacity-90">{curso.descripcion}</p>

						<!-- Stats -->
						<div class="flex flex-wrap items-center gap-6 text-sm">
							<div class="flex items-center gap-1">
								<div class="flex">
									{#each Array(5) as _star, i (i)}
										<svg
											class="h-5 w-5 {i < Math.floor(curso.calificacion)
												? 'text-yellow-400'
												: 'text-gray-400'}"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
											/>
										</svg>
									{/each}
								</div>
								<span class="ml-1 font-semibold">{curso.calificacion}</span>
								<span class="text-gray-300">({curso.numeroResenas} reseñas)</span>
							</div>

							<div class="flex items-center gap-2">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								<span>{curso.instructor}</span>
							</div>

							<div class="flex items-center gap-2">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>{curso.duracion}</span>
							</div>

							<div class="flex items-center gap-2">
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								<span class="capitalize">{curso.modalidad}</span>
							</div>
						</div>
					</div>

					<!-- Card de inscripción (sticky en desktop) -->
					<div class="lg:col-span-1" in:scale={{ duration: 600, delay: 200 }}>
						<div class="sticky top-4 rounded-2xl border-4 border-white/20 bg-white p-6 shadow-2xl">
							<div class="mb-4">
								{#if curso.precioDescuento}
									<div class="mb-2 flex items-center gap-2">
										<span class="text-2xl font-bold text-gray-400 line-through">
											{formatearPrecio(curso.precio)}
										</span>
										<span class="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
											-{Math.round(((curso.precio - curso.precioDescuento) / curso.precio) * 100)}%
										</span>
									</div>
									<div class="text-4xl font-bold text-blue-900">
										{formatearPrecio(curso.precioDescuento)}
									</div>
								{:else}
									<div class="text-4xl font-bold text-blue-900">
										{formatearPrecio(curso.precio)}
									</div>
								{/if}
							</div>

							<a
								href="/capacitaciones/{curso.slug}/pago"
								class="mb-4 block w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-800 py-4 text-center font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
							>
								Inscribirme ahora
							</a>

							<!-- Incluye -->
							<div class="space-y-3 border-t pt-4">
								<h3 class="font-bold text-gray-900">Este curso incluye:</h3>

								<div class="flex items-start gap-3 text-sm text-gray-700">
									<svg
										class="h-5 w-5 shrink-0 text-green-500"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span>{curso.duracion} de contenido</span>
								</div>

								<div class="flex items-start gap-3 text-sm text-gray-700">
									<svg
										class="h-5 w-5 shrink-0 text-green-500"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span>Acceso de por vida</span>
								</div>

								{#if curso.certificacion}
									<div class="flex items-start gap-3 text-sm text-gray-700">
										<svg
											class="h-5 w-5 shrink-0 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										<span>Certificado de finalización</span>
									</div>
								{/if}

								<div class="flex items-start gap-3 text-sm text-gray-700">
									<svg
										class="h-5 w-5 shrink-0 text-green-500"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span>Material descargable</span>
								</div>

								<div class="flex items-start gap-3 text-sm text-gray-700">
									<svg
										class="h-5 w-5 shrink-0 text-green-500"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span>Soporte del instructor</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Contenido del curso -->
		<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<div class="grid gap-8 lg:grid-cols-3">
				<!-- Contenido principal -->
				<div class="lg:col-span-2">
					<!-- Tabs -->
					<div
						class="mb-8 flex gap-4 overflow-x-auto border-b pb-4"
						in:fly={{ y: 20, duration: 600 }}
					>
						<button
							on:click={() => (tabActivo = 'descripcion')}
							class="border-b-2 px-4 py-2 font-semibold whitespace-nowrap transition-all {tabActivo ===
							'descripcion'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-gray-700'}"
						>
							Descripción
						</button>
						<button
							on:click={() => (tabActivo = 'temario')}
							class="border-b-2 px-4 py-2 font-semibold whitespace-nowrap transition-all {tabActivo ===
							'temario'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-gray-700'}"
						>
							Temario
						</button>
						<button
							on:click={() => (tabActivo = 'instructor')}
							class="border-b-2 px-4 py-2 font-semibold whitespace-nowrap transition-all {tabActivo ===
							'instructor'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-gray-700'}"
						>
							Instructor
						</button>
						<button
							on:click={() => (tabActivo = 'resenas')}
							class="border-b-2 px-4 py-2 font-semibold whitespace-nowrap transition-all {tabActivo ===
							'resenas'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-gray-700'}"
						>
							Reseñas
						</button>
					</div>

					<!-- Contenido de tabs -->
					<div class="min-h-[400px]">
						{#if tabActivo === 'descripcion'}
							<div in:fade={{ duration: 300 }}>
								<h2 class="mb-4 text-2xl font-bold text-gray-900">Descripción del curso</h2>
								<p class="mb-6 leading-relaxed text-gray-700">{curso.descripcion}</p>

								<h3 class="mt-8 mb-4 text-xl font-bold text-gray-900">¿Qué aprenderás?</h3>
								<div class="grid gap-3 md:grid-cols-2">
									{#each curso.temario.slice(0, 6) as item}
										<div class="flex items-start gap-2">
											<svg
												class="mt-1 h-5 w-5 shrink-0 text-blue-600"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clip-rule="evenodd"
												/>
											</svg>
											<span class="text-gray-700">{item}</span>
										</div>
									{/each}
								</div>

								<h3 class="mt-8 mb-4 text-xl font-bold text-gray-900">Requisitos</h3>
								<ul class="space-y-2">
									{#each curso.requisitos as requisito}
										<li class="flex items-start gap-2 text-gray-700">
											<span class="text-blue-600">•</span>
											<span>{requisito}</span>
										</li>
									{/each}
								</ul>

								<h3 class="mt-8 mb-4 text-xl font-bold text-gray-900">Nivel</h3>
								<div class="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2">
									<svg
										class="h-5 w-5 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
										/>
									</svg>
									<span class="font-semibold text-blue-900 capitalize">{curso.nivel}</span>
								</div>
							</div>
						{:else if tabActivo === 'temario'}
							<div in:fade={{ duration: 300 }}>
								<h2 class="mb-4 text-2xl font-bold text-gray-900">Contenido del curso</h2>
								<p class="mb-6 text-gray-600">
									{curso.temario.length} módulos • {curso.duracion}
								</p>

								<div class="space-y-3">
									{#each curso.temario as modulo, i}
										<div
											class="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
										>
											<div class="flex items-start gap-3">
												<div
													class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600"
												>
													{i + 1}
												</div>
												<div class="flex-1">
													<h3 class="font-semibold text-gray-900">{modulo}</h3>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{:else if tabActivo === 'instructor'}
							<div in:fade={{ duration: 300 }}>
								<h2 class="mb-6 text-2xl font-bold text-gray-900">Sobre el instructor</h2>

								<div class="rounded-xl bg-gray-50 p-6">
									<div class="mb-4 flex items-center gap-4">
										<div
											class="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-blue-800 text-2xl font-bold text-white"
										>
											{curso.instructor
												.split(' ')
												.map((n) => n[0])
												.join('')}
										</div>
										<div>
											<h3 class="text-xl font-bold text-gray-900">{curso.instructor}</h3>
											<p class="text-gray-600">Experto en {curso.categoria}</p>
										</div>
									</div>

									<div class="mb-4 grid grid-cols-3 gap-4 border-y py-4">
										<div class="text-center">
											<div class="text-2xl font-bold text-blue-600">
												{curso.calificacion}
											</div>
											<div class="text-sm text-gray-600">Calificación</div>
										</div>
										<div class="text-center">
											<div class="text-2xl font-bold text-blue-600">{curso.numeroResenas}</div>
											<div class="text-sm text-gray-600">Reseñas</div>
										</div>
										<div class="text-center">
											<div class="text-2xl font-bold text-blue-600">1</div>
											<div class="text-sm text-gray-600">Curso</div>
										</div>
									</div>

									<p class="leading-relaxed text-gray-700">
										Profesional certificado con más de 10 años de experiencia en el sector. Ha
										capacitado a cientos de profesionales y empresas en {curso.categoria.toLowerCase()},
										con un enfoque práctico y orientado a resultados.
									</p>
								</div>
							</div>
						{:else if tabActivo === 'resenas'}
							<div in:fade={{ duration: 300 }}>
								<h2 class="mb-6 text-2xl font-bold text-gray-900">Reseñas de estudiantes</h2>

								<!-- Resumen de calificaciones -->
								<div class="mb-8 rounded-xl bg-gray-50 p-6">
									<div class="flex items-center gap-8">
										<div class="text-center">
											<div class="text-5xl font-bold text-gray-900">{curso.calificacion}</div>
											<div class="mt-2 flex justify-center">
												{#each Array(5) as _star, i (i)}
													<svg
														class="h-5 w-5 {i < Math.floor(curso.calificacion)
															? 'text-yellow-400'
															: 'text-gray-300'}"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
														/>
													</svg>
												{/each}
											</div>
											<div class="mt-1 text-sm text-gray-600">{curso.numeroResenas} reseñas</div>
										</div>

										<!-- Barras de distribución -->
										<div class="flex-1 space-y-2">
											{#each [5, 4, 3, 2, 1] as stars}
												<div class="flex items-center gap-2">
													<span class="w-16 text-sm text-gray-600">{stars} estrellas</span>
													<div class="h-2 flex-1 rounded-full bg-gray-200">
														<div
															class="h-full rounded-full bg-yellow-400"
															style="width: {stars === 5
																? 75
																: stars === 4
																	? 20
																	: stars === 3
																		? 3
																		: stars === 2
																			? 1
																			: 1}%"
														></div>
													</div>
													<span class="w-12 text-sm text-gray-600">
														{stars === 5
															? 75
															: stars === 4
																? 20
																: stars === 3
																	? 3
																	: stars === 2
																		? 1
																		: 1}%
													</span>
												</div>
											{/each}
										</div>
									</div>
								</div>

								<!-- Reseñas individuales -->
								<div class="space-y-6">
									{#each Array(3) as _review, i (i)}
										<div class="rounded-lg border border-gray-200 bg-white p-6">
											<div class="mb-3 flex items-center justify-between">
												<div class="flex items-center gap-3">
													<div
														class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600"
													>
														{['JD', 'MP', 'LC'][i]}
													</div>
													<div>
														<div class="font-semibold text-gray-900">
															{['Juan Díaz', 'María Pérez', 'Luis Castro'][i]}
														</div>
														<div class="text-sm text-gray-500">Hace {[2, 5, 7][i]} días</div>
													</div>
												</div>
												<div class="flex">
													{#each Array(5) as _star, j (j)}
														<svg
															class="h-4 w-4 text-yellow-400"
															fill="currentColor"
															viewBox="0 0 20 20"
														>
															<path
																d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
															/>
														</svg>
													{/each}
												</div>
											</div>
											<p class="text-gray-700">
												{[
													'Excelente curso, muy completo y con ejemplos prácticos. El instructor explica de forma clara y concisa. Totalmente recomendado.',
													'Me encantó el contenido y la metodología. He podido aplicar lo aprendido en mi trabajo inmediatamente.',
													'Muy buen curso, cumplió con mis expectativas. El material de apoyo es de gran calidad.'
												][i]}
											</p>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Sidebar (vacío en mobile, sticky en desktop) -->
				<div class="hidden lg:col-span-1 lg:block">
					<!-- El espacio se mantiene para el card sticky del hero -->
				</div>
			</div>
		</div>

		<!-- Cursos relacionados -->
		<div class="bg-gray-50 py-16">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h2 class="mb-8 text-3xl font-bold text-gray-900" in:fly={{ y: 20, duration: 600 }}>
					Cursos relacionados
				</h2>

				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each capacitaciones
						.filter((c) => c.categoria === curso.categoria && c.id !== curso.id)
						.slice(0, 3) as cursoRelacionado, i}
						<a
							href="/capacitaciones/{cursoRelacionado.slug}"
							class="group rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
							in:fly={{ y: 30, duration: 600, delay: i * 100 }}
						>
							<div class="relative overflow-hidden rounded-t-2xl">
								<div
									class="flex h-40 items-center justify-center bg-linear-to-br from-blue-600 to-blue-800 text-white"
								>
									<svg
										class="h-16 w-16 opacity-30"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
								</div>
							</div>

							<div class="p-6">
								<h3 class="mb-2 line-clamp-2 font-bold text-gray-900 group-hover:text-blue-600">
									{cursoRelacionado.titulo}
								</h3>

								<div class="mb-3 flex items-center gap-1 text-sm">
									<div class="flex">
										{#each Array(5) as _star, j (j)}
											<svg
												class="h-4 w-4 {j < Math.floor(cursoRelacionado.calificacion)
													? 'text-yellow-400'
													: 'text-gray-300'}"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
												/>
											</svg>
										{/each}
									</div>
									<span class="font-semibold text-gray-900">{cursoRelacionado.calificacion}</span>
									<span class="text-gray-500">({cursoRelacionado.numeroResenas})</span>
								</div>

								<div class="mb-4 flex items-center justify-between text-sm text-gray-600">
									<span>{cursoRelacionado.duracion}</span>
									<span class="capitalize">{cursoRelacionado.modalidad}</span>
								</div>

								<div class="flex items-center justify-between">
									{#if cursoRelacionado.precioDescuento}
										<div>
											<div class="text-sm text-gray-400 line-through">
												{formatearPrecio(cursoRelacionado.precio)}
											</div>
											<div class="text-xl font-bold text-blue-600">
												{formatearPrecio(cursoRelacionado.precioDescuento)}
											</div>
										</div>
									{:else}
										<div class="text-xl font-bold text-blue-600">
											{formatearPrecio(cursoRelacionado.precio)}
										</div>
									{/if}
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</main>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
