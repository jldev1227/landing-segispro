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
			emoji: '📟',
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
	let direction: 'up' | 'down' = 'down';
	let progressIntervals: Map<number, ReturnType<typeof setInterval>> = new Map();
	let progressValues: Map<number, number> = new Map();

	const AUTO_SCROLL_DURATION = 5000; // 5 segundos por slide

	// Inicializar progress values
	serviceGroups.forEach((_, index) => {
		progressValues.set(index, 0);
	});

	function goToIndex(index: number) {
		if (isAnimating || index === currentIndex) return;
		direction = index > currentIndex ? 'down' : 'up';
		isAnimating = true;

		// Resetear todos los progress
		progressIntervals.forEach((interval) => clearInterval(interval));
		progressIntervals.clear();
		serviceGroups.forEach((_, i) => {
			progressValues.set(i, 0);
		});

		setTimeout(() => {
			currentIndex = index;
			isAnimating = false;
			startProgress(index);
		}, 400);
	}

	function startProgress(index: number) {
		// Limpiar intervalo anterior si existe
		const existingInterval = progressIntervals.get(index);
		if (existingInterval) {
			clearInterval(existingInterval);
		}

		progressValues.set(index, 0);

		const intervalTime = 50; // Actualizar cada 50ms
		const increment = 100 / (AUTO_SCROLL_DURATION / intervalTime);

		const interval = setInterval(() => {
			const currentProgress = progressValues.get(index) || 0;
			const newProgress = currentProgress + increment;

			if (newProgress >= 100) {
				progressValues.set(index, 100);
				clearInterval(interval);
				progressIntervals.delete(index);

				// Ir al siguiente automáticamente
				setTimeout(() => {
					const nextIndex = (index + 1) % serviceGroups.length;
					goToIndex(nextIndex);
				}, 200);
			} else {
				progressValues.set(index, newProgress);
				progressValues = progressValues; // Trigger reactivity
			}
		}, intervalTime);

		progressIntervals.set(index, interval);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowUp') {
			const prevIndex = (currentIndex - 1 + serviceGroups.length) % serviceGroups.length;
			goToIndex(prevIndex);
		}
		if (e.key === 'ArrowDown') {
			const nextIndex = (currentIndex + 1) % serviceGroups.length;
			goToIndex(nextIndex);
		}
	}

	onMount(() => {
		startProgress(0);
		window.addEventListener('keydown', handleKeydown);

		return () => {
			progressIntervals.forEach((interval) => clearInterval(interval));
			progressIntervals.clear();
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if visible}
	<div class="relative w-full" in:fly={{ y: 30, duration: 600 }}>
		<!-- Vista Desktop: Grid con lista de navegación a la izquierda -->
		<div class="hidden lg:block">
			<div class="grid grid-cols-[300px_1fr] gap-6">
				<!-- Lista de navegación a la izquierda -->
				<div class="space-y-2">
					{#each serviceGroups as group, index}
						<button
							on:click={() => goToIndex(index)}
							class="group relative w-full overflow-hidden rounded-xl border-2 transition-all duration-300 {currentIndex ===
							index
								? 'border-blue-600 bg-blue-50'
								: 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'}"
							aria-label={`Ir a ${group.header}`}
						>
							<div class="relative z-10 flex items-center gap-3 p-4">
								<div
									class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-2xl transition-transform duration-300 {currentIndex ===
									index
										? 'scale-110 bg-blue-600'
										: 'bg-gray-100 group-hover:scale-105'}"
								>
									<span class={currentIndex === index ? 'grayscale-0' : 'opacity-70 grayscale'}>
										{group.emoji}
									</span>
								</div>
								<div class="min-w-0 flex-1 text-left">
									<h4
										class="truncate text-sm font-semibold transition-colors {currentIndex === index
											? 'text-blue-900'
											: 'text-gray-700 group-hover:text-blue-700'}"
									>
										{group.header}
									</h4>
								</div>
							</div>

							<!-- Barra de progreso animada -->
							{#if currentIndex === index}
								<div
									class="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-100 ease-linear"
									style="width: {progressValues.get(index) || 0}%"
								></div>
							{/if}
						</button>
					{/each}
				</div>

				<!-- Contenido del servicio a la derecha -->
				<div class="relative min-h-[500px] md:min-h-[450px]">
					{#key currentIndex}
						<div
							class="absolute inset-0"
							in:fly={{
								y: direction === 'down' ? -50 : 50,
								duration: 400,
								easing: quintOut
							}}
							out:fly={{
								y: direction === 'down' ? 50 : -50,
								duration: 400,
								easing: quintOut
							}}
						>
							<div
								class="h-full overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-blue-700 p-8 shadow-2xl lg:p-10"
							>
								<!-- Elementos decorativos -->
								<div
									class="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl"
								></div>
								<div
									class="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
								></div>

								<!-- Contenido -->
								<div class="relative z-10 h-full">
									<!-- Header -->
									<div class="mb-6">
										<div class="flex items-center gap-3">
											<div
												class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-3xl backdrop-blur-sm"
											>
												{serviceGroups[currentIndex].emoji}
											</div>
											<div class="min-w-0 flex-1">
												<h3 class="mb-1.5 text-2xl font-bold text-white">
													{serviceGroups[currentIndex].header}
												</h3>
												<div
													class="h-0.5 w-20 rounded-full bg-linear-to-r from-blue-300 to-blue-400"
												></div>
											</div>
										</div>
									</div>

									<!-- Grid de servicios -->
									<div class="grid auto-rows-fr grid-cols-1 gap-4 lg:grid-cols-3">
										{#each serviceGroups[currentIndex].sections as section, sIndex}
											<div
												class="service-card group/card relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl hover:shadow-blue-500/30"
												in:fly={{ y: 20, duration: 400, delay: sIndex * 100 }}
											>
												<div
													class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent"
												></div>

												<div
													class="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
												></div>

												<div class="relative z-10 mb-3 flex items-center gap-2">
													<div
														class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-400 to-blue-500 text-lg shadow-lg transition-all duration-300 group-hover/card:scale-110 group-hover/card:rotate-6"
													>
														{section.icon}
													</div>
													<h4 class="flex-1 text-xs font-bold tracking-wider text-white uppercase">
														{section.title}
													</h4>
												</div>

												<div class="mb-3 h-px bg-white/20"></div>

												<ul class="relative z-10 flex-1 space-y-2">
													{#each section.items as item}
														<li
															class="group/item flex items-start gap-2 transition-all duration-200"
														>
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
															<span
																class="min-w-0 flex-1 text-sm leading-tight font-medium text-gray-100 transition-colors duration-200 group-hover/item:text-white"
															>
																{item}
															</span>
														</li>
													{/each}
												</ul>

												{#if section.items.length === 0}
													<div class="flex flex-1 items-center justify-center py-3">
														<p class="text-xs text-blue-200 italic">Próximamente</p>
													</div>
												{/if}

												<div
													class="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-linear-to-br from-blue-400/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
												></div>
											</div>
										{/each}
									</div>

									<!-- Botón Ver más -->
									<div class="relative z-10 mt-8 flex justify-center">
										<a
											href={serviceGroups[currentIndex].link}
											class="group/btn inline-flex items-center gap-2 rounded-xl bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
										>
											<span>Ver más</span>
											<svg
												class="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1"
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
			</div>
		</div>

		<!-- Vista Mobile/Tablet: Scroll estático vertical -->
		<div class="block lg:hidden">
			<div class="space-y-4 sm:space-y-5">
				{#each serviceGroups as group, groupIndex}
					<div
						class="overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 to-blue-700 p-3.5 shadow-2xl sm:p-5"
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
