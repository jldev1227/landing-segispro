<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { serviciosData } from '$lib/data/servicios';

	interface ServiceItem {
		title: string;
		items: string[];
		icon: string;
	}

	interface ServiceGroup {
		header: string;
		headerColor: string;
		sections: ServiceItem[];
		emoji: string;
		accentColor: string;
		link: string;
	}

	export let visible = false;

	// Transformar serviciosData al formato del carrusel
	const serviceGroups: ServiceGroup[] = [
		{
			header: 'Consultoría y Auditoría',
			headerColor: 'from-blue-600 to-blue-700',
			emoji: '🧩',
			accentColor: 'blue',
			sections: [
				{
					title: 'NORMAS ISO PRINCIPALES',
					icon: '📋',
					items: [
						'ISO 9001 - Calidad',
						'ISO 14001 - Ambiental',
						'ISO 45001 - SST',
						'ISO 39001 - Seguridad Vial'
					]
				},
				{
					title: 'CERTIFICACIONES',
					icon: '✓',
					items: ['BASC', 'RUC / RUC Transporte', 'NORSOK S-006']
				},
				{
					title: 'NORMATIVA COLOMBIANA',
					icon: '⚖️',
					items: ['SG-SST Decreto 1072', 'PESV Res. 40595', 'SARLAFT Res. 2328', 'TRAST']
				}
			],
			link: '/servicios/consultoria-asesoria'
		},
		{
			header: 'Formación, Capacitación y Campañas',
			headerColor: 'from-blue-600 to-blue-700',
			emoji: '🎓',
			accentColor: 'blue',
			sections: [
				{
					title: 'CURSOS ESPECIALIZADOS',
					icon: '📚',
					items: [
						'Manejo Defensivo',
						'Mercancías Peligrosas',
						'Comando de Incidentes',
						'Auditoría Interna'
					]
				},
				{
					title: 'CAMPAÑAS INSTITUCIONALES',
					icon: '📢',
					items: ['Seguridad Vial', 'Vida Saludable', 'Identificación de Peligros', 'Cultura Ética']
				},
				{
					title: 'SIMULACROS Y PRÁCTICA',
					icon: '�️',
					items: [
						'Simulacros Ambientales',
						'Primeros Auxilios',
						'Capacitaciones SST',
						'Respuesta a Emergencias'
					]
				}
			],
			link: '/servicios/formacion'
		},
		{
			header: 'Estudios Técnicos',
			headerColor: 'from-blue-600 to-blue-700',
			emoji: '�',
			accentColor: 'blue',
			sections: [
				{
					title: 'ESTUDIOS AMBIENTALES',
					icon: '🌿',
					items: ['Luxometría', 'Sonometría', 'Evaluaciones Ambientales']
				},
				{
					title: 'SALUD LABORAL',
					icon: '🩺',
					items: [
						'Factores Psicosociales',
						'Tamizajes de Salud',
						'Análisis de Puestos',
						'Clima Organizacional'
					]
				},
				{
					title: 'ESTUDIOS VIALES',
					icon: '🚦',
					items: ['Medición con Radar', 'Evaluación de Respuesta', 'Inspecciones Viales']
				}
			],
			link: '/servicios/campanas-estudios'
		},
		{
			header: 'Digitalización y Proyectos Especiales',
			headerColor: 'from-blue-600 to-blue-700',
			emoji: '⚙️',
			accentColor: 'blue',
			sections: [
				{
					title: 'DIGITALIZACIÓN',
					icon: '💻',
					items: [
						'Formatos Digitales',
						'Tableros de Control',
						'Integración con Plataformas',
						'Apps Personalizadas'
					]
				},
				{
					title: 'PROYECTOS ESPECIALES',
					icon: '🛠️',
					items: [
						'Modelos de Gestión',
						'Herramientas a Medida',
						'Metodologías Propias',
						'Laboratorios de Innovación'
					]
				},
				{
					title: 'PROYECTO INTEGRAL VIAL',
					icon: '🚗',
					items: [
						'Plan PESV ISO 39001',
						'Auditoría Vial',
						'Capacitaciones',
						'Inspecciones y Control'
					]
				}
			],
			link: '/servicios/digitalizacion'
		},
		{
			header: 'Interventoría',
			headerColor: 'from-blue-600 to-blue-700',
			emoji: '📋',
			accentColor: 'blue',
			sections: [
				{
					title: 'TIPOS DE INTERVENTORÍA',
					icon: '🔍',
					items: ['Obras Civiles', 'Seguridad Vial', 'Sistemas de Gestión', 'Proyectos Especiales']
				},
				{
					title: 'METODOLOGÍA',
					icon: '📊',
					items: [
						'Matrices de Seguimiento',
						'Informes Trazables',
						'Herramientas Digitales',
						'Supervisión en Campo'
					]
				}
			],
			link: '/servicios/interventoria'
		}
	];

	let currentIndex = 0;
	let isAnimating = false;
	let lastInteractionTime = Date.now();
	let isAutoScrolling = true;
	let autoScrollInterval: ReturnType<typeof setInterval>;
	let direction: 'up' | 'down' = 'down';

	const INTERACTION_TIMEOUT = 5000;
	const AUTO_SCROLL_INTERVAL = 4000;

	function goToNext() {
		if (isAnimating) return;
		direction = 'down';
		isAnimating = true;

		setTimeout(() => {
			currentIndex = (currentIndex + 1) % serviceGroups.length;
			isAnimating = false;
		}, 400);

		resetAutoScroll();
	}

	function goToPrev() {
		if (isAnimating) return;
		direction = 'up';
		isAnimating = true;

		setTimeout(() => {
			currentIndex = (currentIndex - 1 + serviceGroups.length) % serviceGroups.length;
			isAnimating = false;
		}, 400);

		resetAutoScroll();
	}

	function goToIndex(index: number) {
		if (isAnimating || index === currentIndex) return;
		direction = index > currentIndex ? 'down' : 'up';
		isAnimating = true;

		setTimeout(() => {
			currentIndex = index;
			isAnimating = false;
		}, 400);

		resetAutoScroll();
	}

	function resetAutoScroll() {
		lastInteractionTime = Date.now();
		isAutoScrolling = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') goToPrev();
		if (e.key === 'ArrowRight') goToNext();
	}

	function startAutoScroll() {
		autoScrollInterval = setInterval(() => {
			if (isAutoScrolling && Date.now() - lastInteractionTime >= INTERACTION_TIMEOUT) {
				goToNext();
			}
			if (!isAutoScrolling && Date.now() - lastInteractionTime >= INTERACTION_TIMEOUT) {
				isAutoScrolling = true;
			}
		}, AUTO_SCROLL_INTERVAL);
	}

	onMount(() => {
		startAutoScroll();
		window.addEventListener('keydown', handleKeydown);

		return () => {
			clearInterval(autoScrollInterval);
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if visible}
	<div class="relative w-full" in:fly={{ y: 30, duration: 600 }}>
		<!-- Vista Desktop: Cards apiladas con animación -->
		<div class="hidden lg:block">
			<!-- Contenedor de cards apiladas -->
			<div class="relative min-h-[344px] w-full overflow-hidden sm:min-h-[379px] md:min-h-[413px]">
				<!-- Cards Stack -->
				{#key currentIndex}
					<div
						class="absolute inset-0 w-full"
						style="border-radius: 1.5rem; will-change: transform;"
						in:fly={{
							y: direction === 'down' ? -100 : 100,
							duration: 500,
							easing: quintOut
						}}
						out:fly={{
							y: direction === 'down' ? 100 : -100,
							duration: 500,
							easing: quintOut
						}}
					>
						<!-- Card actual -->
						<div
							class="relative h-full w-full overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 via-blue-800 to-blue-900 p-8 shadow-2xl lg:p-10 xl:p-12"
						>
							<!-- Elementos decorativos sutiles -->
							<div
								class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl"
							></div>
							<div
								class="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
							></div>

							<!-- Contenido principal -->
							<div class="relative z-10 h-full">
								<!-- Header compacto -->
								<div class="mb-5 md:mb-6">
									<div class="flex items-center gap-3">
										<div
											class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl backdrop-blur-sm md:h-14 md:w-14 md:text-3xl"
										>
											{serviceGroups[currentIndex].emoji}
										</div>
										<div class="min-w-0 flex-1">
											<h3 class="mb-1.5 text-lg font-bold text-white md:text-xl lg:text-2xl">
												{serviceGroups[currentIndex].header}
											</h3>
											<div
												class="h-0.5 w-16 rounded-full bg-linear-to-r from-blue-300 to-blue-400 md:w-20"
											></div>
										</div>
									</div>
								</div>

								<!-- Grid de servicios compacto -->
								<div class="grid auto-rows-fr grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
									{#each serviceGroups[currentIndex].sections as section, sIndex}
										<div
											class="service-card group/card relative flex h-full min-h-[180px] flex-col overflow-hidden rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl hover:shadow-blue-500/30 md:p-3.5"
											in:fly={{ y: 20, duration: 400, delay: sIndex * 100 }}
										>
											<!-- Efecto de brillo superior -->
											<div
												class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent"
											></div>

											<!-- Gradiente hover -->
											<div
												class="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
											></div>

											<!-- Header compacto -->
											<div class="relative z-10 mb-3 flex items-center gap-2">
												<div
													class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-400 to-blue-500 text-base shadow-lg transition-all duration-300 group-hover/card:scale-110 group-hover/card:rotate-6 sm:h-9 sm:w-9 sm:text-lg"
												>
													{section.icon}
												</div>
												<h4
													class="flex-1 text-[10px] font-bold tracking-wider text-white uppercase sm:text-xs"
												>
													{section.title}
												</h4>
											</div>

											<!-- Separador delgado -->
											<div class="mb-2.5 h-px bg-white/20"></div>

											<!-- Lista compacta -->
											<ul class="relative z-10 flex-1 space-y-1.5">
												{#each section.items as item}
													<li class="group/item flex items-start gap-2 transition-all duration-200">
														<!-- Check icon pequeño -->
														<div
															class="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-blue-400/20 transition-all duration-200 group-hover/item:scale-110 group-hover/item:bg-blue-400/30"
														>
															<svg
																class="h-2 w-2 text-blue-300"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path
																	fill-rule="evenodd"
																	d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																	clip-rule="evenodd"
																/>
															</svg>
														</div>
														<!-- Texto compacto -->
														<span
															class="min-w-0 flex-1 text-xs leading-tight font-medium text-gray-100 transition-colors duration-200 group-hover/item:text-white sm:text-sm"
														>
															{item}
														</span>
													</li>
												{/each}
											</ul>

											{#if section.items.length === 0}
												<div class="flex flex-1 items-center justify-center py-3">
													<p class="text-[10px] text-blue-200 italic sm:text-xs">Próximamente</p>
												</div>
											{/if}

											<!-- Efecto de esquina -->
											<div
												class="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-linear-to-br from-blue-400/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
											></div>
										</div>
									{/each}
								</div>

								<!-- Botón Ver más de la categoría -->
								<div class="relative z-10 mt-6 flex justify-center md:mt-8">
									<a
										href="/servicios"
										class="group/btn inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 md:px-8 md:py-3.5 md:text-base"
									>
										<span>Ver más</span>
										<svg
											class="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 md:h-5 md:w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</a>
								</div>
							</div>
						</div>
					</div>
				{/key}
			</div>

			<!-- Botones de navegación - Solo desktop -->
			<button
				on:click={goToPrev}
				class="absolute top-1/2 left-2 z-50 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-white/20 bg-white/95 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/30 hover:bg-white hover:shadow-2xl active:scale-95 sm:left-4 sm:h-14 sm:w-14"
				aria-label="Anterior"
			>
				<svg
					class="h-5 w-5 text-blue-700 sm:h-6 sm:w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="3"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<button
				on:click={goToNext}
				class="absolute top-1/2 right-2 z-50 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-white/20 bg-white/95 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/30 hover:bg-white hover:shadow-2xl active:scale-95 sm:right-4 sm:h-14 sm:w-14"
				aria-label="Siguiente"
			>
				<svg
					class="h-5 w-5 text-blue-700 sm:h-6 sm:w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="3"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</button>

			<!-- Indicadores mejorados - Solo desktop -->
			<div class="mt-8 space-y-4 text-center">
				<!-- Dots con mejor visualización -->
				<div class="flex items-center justify-center gap-3">
					{#each serviceGroups as group, i}
						<button
							on:click={() => goToIndex(i)}
							class="group relative transition-all duration-300"
							aria-label={`Ir a ${group.header}`}
						>
							<!-- Dot principal -->
							<div
								class="relative h-3 rounded-full transition-all duration-300 {currentIndex === i
									? 'w-12 bg-blue-600 shadow-lg shadow-blue-600/50'
									: 'w-3 bg-gray-300 hover:bg-gray-400'}"
							></div>

							<!-- Tooltip -->
							<div
								class="pointer-events-none absolute -top-12 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-blue-900 px-3 py-2 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100"
							>
								{group.header}
								<div
									class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-blue-900"
								></div>
							</div>
						</button>
					{/each}
				</div>

				<!-- Contador y estado -->
				<div class="flex items-center justify-center gap-4 text-sm text-gray-600">
					<span class="font-medium">
						{currentIndex + 1} / {serviceGroups.length}
					</span>
				</div>
			</div>
		</div>

		<!-- Vista Mobile/Tablet: Scroll estático vertical -->
		<div class="block lg:hidden">
			<div class="space-y-4 sm:space-y-5">
				{#each serviceGroups as group, groupIndex}
					<div
						class="overflow-hidden rounded-2xl bg-linear-to-br from-blue-700 via-blue-800 to-blue-900 p-3.5 shadow-2xl sm:p-5"
						in:fly={{ y: 20, duration: 400, delay: groupIndex * 150 }}
					>
						<!-- Header del servicio compacto -->
						<div class="relative z-10 mb-4 sm:mb-5">
							<div class="mb-3 flex items-center gap-2.5 sm:mb-4 sm:gap-3">
								<div
									class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl backdrop-blur-sm sm:h-12 sm:w-12 sm:text-3xl"
								>
									{group.emoji}
								</div>
								<div class="min-w-0 flex-1">
									<h3 class="mb-1.5 text-lg font-bold text-white sm:text-xl">
										{group.header}
									</h3>
									<div
										class="h-0.5 w-14 rounded-full bg-linear-to-r from-blue-300 to-blue-400 sm:w-16"
									></div>
								</div>
							</div>
						</div>

						<!-- Grid de servicios responsive compacto -->
						<div class="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
							{#each group.sections as section}
								<div
									class="service-card group/card relative flex flex-col overflow-hidden rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/15 sm:p-3"
								>
									<!-- Efecto de brillo superior -->
									<div
										class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent"
									></div>

									<!-- Header de la subcategoría compacto -->
									<div class="relative z-10 mb-2.5 flex items-center gap-2 sm:mb-3">
										<div
											class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-400 to-blue-500 text-base shadow-lg sm:h-9 sm:w-9 sm:text-lg"
										>
											{section.icon}
										</div>
										<h4
											class="flex-1 text-[10px] font-bold tracking-wider text-white uppercase sm:text-xs"
										>
											{section.title}
										</h4>
									</div>

									<!-- Separador delgado -->
									<div class="mb-2 h-px bg-white/20 sm:mb-2.5"></div>

									<!-- Lista de items compacta -->
									<ul class="relative z-10 flex-1 space-y-1.5">
										{#each section.items as item}
											<li class="flex items-start gap-2">
												<!-- Check icon pequeño -->
												<div
													class="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-blue-400/20"
												>
													<svg
														class="h-2 w-2 text-blue-300"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fill-rule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clip-rule="evenodd"
														/>
													</svg>
												</div>
												<!-- Texto compacto -->
												<span
													class="min-w-0 flex-1 text-xs leading-tight font-medium text-gray-100 sm:text-sm"
												>
													{item}
												</span>
											</li>
										{/each}
									</ul>

									{#if section.items.length === 0}
										<div class="flex items-center justify-center py-2.5">
											<p class="text-[10px] text-blue-200 italic sm:text-xs">Próximamente</p>
										</div>
									{/if}
								</div>
							{/each}
						</div>

						<!-- Botón Ver más de la categoría -->
						<div class="relative z-10 mt-5 flex justify-center sm:mt-6">
							<a
								href={group.link}
								class="group/btn inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 sm:px-6 sm:py-3 sm:text-base"
							>
								<span>Ver más</span>
								<svg
									class="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 sm:h-5 sm:w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Animación de entrada de las cards */
	.service-card {
		transform-style: preserve-3d;
		backface-visibility: hidden;
	}

	/* Mejora del efecto hover en las cards */
	.service-card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		padding: 2px;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		opacity: 0;
		transition: opacity 0.3s;
	}

	.service-card:hover::before {
		opacity: 1;
	}
</style>
