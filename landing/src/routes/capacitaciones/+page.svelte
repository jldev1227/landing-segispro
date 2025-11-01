<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { capacitaciones, categorias, modalidades, niveles } from '$lib/data/capacitaciones';

	let mounted = false;
	let filtroCategoria = 'Todas';
	let filtroModalidad = 'Todas';
	let filtroNivel = 'Todos';
	let busqueda = '';
	let ordenamiento = 'destacado';

	$: cursosFiltrados = capacitaciones
		.filter((curso) => {
			const cumpleCategoria =
				filtroCategoria === 'Todas' || curso.categoria === filtroCategoria;
			const cumpleModalidad = filtroModalidad === 'Todas' || curso.modalidad === filtroModalidad;
			const cumpleNivel = filtroNivel === 'Todos' || curso.nivel === filtroNivel;
			const cumpleBusqueda =
				busqueda === '' ||
				curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
				curso.descripcion.toLowerCase().includes(busqueda.toLowerCase());

			return cumpleCategoria && cumpleModalidad && cumpleNivel && cumpleBusqueda;
		})
		.sort((a, b) => {
			if (ordenamiento === 'destacado') {
				return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0);
			} else if (ordenamiento === 'precio-asc') {
				return (a.precioDescuento || a.precio) - (b.precioDescuento || b.precio);
			} else if (ordenamiento === 'precio-desc') {
				return (b.precioDescuento || b.precio) - (a.precioDescuento || a.precio);
			} else if (ordenamiento === 'calificacion') {
				return b.calificacion - a.calificacion;
			}
			return 0;
		});

	function formatearPrecio(precio: number): string {
		return new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			minimumFractionDigits: 0
		}).format(precio);
	}

	function calcularDescuento(precio: number, precioDescuento: number): number {
		return Math.round(((precio - precioDescuento) / precio) * 100);
	}

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>Capacitaciones y Cursos - SEGISPRO</title>
	<meta
		name="description"
		content="Descubre nuestro catálogo de capacitaciones profesionales en seguridad industrial, auditorías, gestión de riesgos y más. Certifícate con SEGISPRO."
	/>
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
			<div class="flex items-center gap-4">
				<a
					href="/validar-certificado"
					class="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 sm:block"
				>
					Validar certificado
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
					Inicio
				</a>
			</div>
		</div>
	</nav>
</header>

<!-- Main Content -->
<main class="bg-linear-to-br min-h-screen from-white via-gray-50 to-blue-50 px-4 pb-20 pt-24 sm:px-6">
	<div class="container mx-auto max-w-7xl">
		{#if mounted}
			<!-- Hero Section -->
			<div in:fly={{ y: 30, duration: 600 }} class="mb-12 text-center">
				<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
					<svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
					<span class="text-sm font-semibold text-blue-600">Formación Profesional</span>
				</div>
				<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
					Capacitaciones <span class="text-blue-600">Certificadas</span>
				</h1>
				<p class="mx-auto max-w-2xl text-lg text-gray-600">
					Impulsa tu carrera profesional con nuestros cursos especializados en seguridad
					industrial, auditorías y sistemas de gestión.
				</p>
				<div class="bg-linear-to-r mx-auto mt-6 h-1.5 w-24 rounded-full from-blue-600 to-orange-600">
				</div>
			</div>

			<!-- Filtros y Búsqueda -->
			<div
				in:fly={{ y: 30, duration: 800, delay: 200 }}
				class="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
			>
				<!-- Barra de búsqueda -->
				<div class="mb-6">
					<div class="relative">
						<svg
							class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						<input
							type="text"
							bind:value={busqueda}
							placeholder="Buscar cursos..."
							class="w-full rounded-lg border-2 border-gray-200 py-3 pl-12 pr-4 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
						/>
					</div>
				</div>

			<!-- Filtros -->
			<div class="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
				<!-- Categoría -->
				<div>
					<label for="filtro-categoria" class="mb-2 block text-sm font-semibold text-gray-700">Categoría</label>
					<select
						id="filtro-categoria"
						bind:value={filtroCategoria}
						class="w-full rounded-lg border-2 border-gray-200 px-4 py-2 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
					>
						{#each categorias as categoria}
							<option value={categoria}>{categoria}</option>
						{/each}
					</select>
				</div>

				<!-- Modalidad -->
				<div>
					<label for="filtro-modalidad" class="mb-2 block text-sm font-semibold text-gray-700">Modalidad</label>
					<select
						id="filtro-modalidad"
						bind:value={filtroModalidad}
						class="w-full rounded-lg border-2 border-gray-200 px-4 py-2 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
					>
						{#each modalidades as modalidad}
							<option value={modalidad}>{modalidad}</option>
						{/each}
					</select>
				</div>

				<!-- Nivel -->
				<div>
					<label for="filtro-nivel" class="mb-2 block text-sm font-semibold text-gray-700">Nivel</label>
					<select
						id="filtro-nivel"
						bind:value={filtroNivel}
						class="w-full rounded-lg border-2 border-gray-200 px-4 py-2 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
					>
						{#each niveles as nivel}
							<option value={nivel}>{nivel}</option>
						{/each}
					</select>
				</div>

				<!-- Ordenamiento -->
				<div>
					<label for="ordenamiento" class="mb-2 block text-sm font-semibold text-gray-700">Ordenar por</label>
					<select
						id="ordenamiento"
						bind:value={ordenamiento}
						class="w-full rounded-lg border-2 border-gray-200 px-4 py-2 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
					>
						<option value="destacado">Destacados</option>
						<option value="calificacion">Mejor calificados</option>
					<option value="precio-asc">Menor precio</option>
					<option value="precio-desc">Mayor precio</option>
				</select>
			</div>
		</div>				<!-- Contador de resultados -->
			<div class="mt-4 text-sm text-gray-600">
				Mostrando <span class="font-semibold text-gray-900">{cursosFiltrados.length}</span>
				{cursosFiltrados.length === 1 ? 'curso' : 'cursos'}
			</div>
		</div>

		<!-- Grid de Cursos -->
		{#if cursosFiltrados.length > 0}
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each cursosFiltrados as curso, i (curso.id)}
						<div
							in:scale={{ duration: 400, delay: i * 50, start: 0.9 }}
							class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
						>
							<!-- Badge destacado -->
							{#if curso.destacado}
								<div
									class="absolute left-4 top-4 z-10 rounded-full bg-linear-to-r from-orange-500 to-red-500 p-2 text-xs font-bold text-white shadow-lg"
								>
									⭐ Destacado
								</div>
							{/if}

							<!-- Badge cupo limitado -->
							{#if curso.cupoLimitado}
								<div
									class="absolute right-4 top-4 z-10 rounded-full bg-linear-to-r from-red-600 to-red-700 p-2 text-xs font-bold text-white shadow-lg"
								>
									🔥 Cupo limitado
								</div>
							{/if}

							<!-- Imagen -->
							<div class="relative h-48 overflow-hidden bg-linear-to-br from-blue-100 to-blue-200">
								<!-- Placeholder mientras no tengamos imágenes reales -->
								<div
									class="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-600 to-blue-800 text-white"
								>
									<svg class="h-20 w-20 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
								</div>
								<!-- Overlay -->
								<div
									class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								></div>
							</div>

							<!-- Contenido -->
							<div class="p-6">
								<!-- Categoría y modalidad -->
								<div class="mb-3 flex items-center gap-2">
									<span
										class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
									>
										{curso.categoria}
									</span>
									<span
										class="rounded-full px-3 py-1 text-xs font-semibold"
										class:bg-green-100={curso.modalidad === 'Virtual'}
										class:text-green-700={curso.modalidad === 'Virtual'}
										class:bg-purple-100={curso.modalidad === 'Presencial'}
										class:text-purple-700={curso.modalidad === 'Presencial'}
										class:bg-orange-100={curso.modalidad === 'Híbrida'}
										class:text-orange-700={curso.modalidad === 'Híbrida'}
									>
										{curso.modalidad}
									</span>
								</div>

								<!-- Título -->
								<h3 class="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600">
									{curso.titulo}
								</h3>

								<!-- Descripción -->
								<p class="mb-4 line-clamp-2 text-sm text-gray-600">
									{curso.descripcion}
								</p>

								<!-- Instructor -->
								<p class="mb-3 flex items-center gap-2 text-sm text-gray-700">
									<svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									{curso.instructor}
								</p>

								<!-- Detalles -->
								<div class="mb-4 flex items-center gap-4 text-sm text-gray-600">
									<!-- Duración -->
									<div class="flex items-center gap-1">
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

									<!-- Nivel -->
									<div class="flex items-center gap-1">
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
										<span>{curso.nivel}</span>
									</div>
								</div>

								<!-- Calificación -->
								<div class="mb-4 flex items-center gap-2">
									<div class="flex items-center">
										{#each Array(5) as _, index}
											<svg
												class="h-4 w-4"
												class:text-yellow-400={index < Math.floor(curso.calificacion)}
												class:text-gray-300={index >= Math.floor(curso.calificacion)}
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
												/>
											</svg>
										{/each}
									</div>
									<span class="text-sm font-semibold text-gray-900">{curso.calificacion}</span>
									<span class="text-sm text-gray-500">({curso.numeroResenas})</span>
								</div>

								<!-- Precio -->
								<div class="mb-4 border-t border-gray-200 pt-4">
									{#if curso.precioDescuento}
										<div class="flex items-center gap-2">
											<span class="text-sm text-gray-500 line-through">
												{formatearPrecio(curso.precio)}
											</span>
											<span
												class="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700"
											>
												-{calcularDescuento(curso.precio, curso.precioDescuento)}%
											</span>
										</div>
										<div class="text-2xl font-bold text-gray-900">
											{formatearPrecio(curso.precioDescuento)}
										</div>
									{:else}
										<div class="text-2xl font-bold text-gray-900">
											{formatearPrecio(curso.precio)}
										</div>
									{/if}
								</div>

								<!-- Botones -->
								<div class="grid gap-2">
									<a
										href="/capacitaciones/{curso.slug}"
										class="flex items-center justify-center gap-2 rounded-lg border-2 border-blue-600 bg-blue-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
									>
										Ver detalles
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</a>
									<a
										href="/capacitaciones/{curso.slug}?inscribirse=true"
										class="flex items-center justify-center gap-2 rounded-lg border-2 border-blue-600 bg-white px-4 py-3 font-semibold text-blue-600 transition-all duration-300 hover:bg-blue-50"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
											/>
										</svg>
										Inscribirse ahora
									</a>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div in:fade={{ duration: 400 }} class="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
					<svg
						class="mx-auto mb-4 h-16 w-16 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h3 class="mb-2 text-xl font-bold text-gray-900">No se encontraron cursos</h3>
					<p class="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
				</div>
			{/if}

			<!-- CTA Bottom -->
			<div in:fly={{ y: 30, duration: 800, delay: 400 }} class="mt-16 rounded-3xl bg-linear-to-r from-blue-600 to-blue-800 p-8 text-center text-white shadow-2xl md:p-12">
				<h2 class="mb-4 text-3xl font-bold md:text-4xl">¿No encuentras lo que buscas?</h2>
				<p class="mb-8 text-lg opacity-90">
					Contáctanos para diseñar una capacitación personalizada para tu empresa
				</p>
				<a
					href="/#contacto"
					class="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-bold text-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
				>
					Contactar ahora
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</a>
			</div>
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

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
