<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';

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
	}

	export let visible = false;

	// Datos de servicios con mejor estructura
	const serviceGroups: ServiceGroup[] = [
		{
			header: 'Consultoría & Asesoría',
			headerColor: 'from-blue-600 to-blue-700',
			emoji: '🎯',
			accentColor: 'blue',
			sections: [
				{
					title: 'NORMAS ISO',
					icon: '📋',
					items: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 39001']
				},
				{
					title: 'CERTIFICACIONES',
					icon: '✓',
					items: ['RUC', 'RUC Transporte', 'BASC']
				},
				{
					title: 'MARCO LEGAL',
					icon: '⚖️',
					items: ['SG-SST 1072', 'PESV 40595', 'SARLAFT 2328']
				}
			]
		},
		{
			header: 'Formación & Capacitación',
			headerColor: 'from-blue-600 to-blue-700',
			emoji: '🎓',
			accentColor: 'blue',
			sections: [
				{
					title: 'CURSOS',
					icon: '📚',
					items: ['Manejo Defensivo', 'Mercancías Peligrosas', 'Comando de Incidentes']
				},
				{
					title: 'CAMPAÑAS',
					icon: '📢',
					items: ['Seguridad Vial', 'Vida Saludable', 'Riesgos Ambientales']
				},
				{
					title: 'PRÁCTICA',
					icon: '🚨',
					items: ['Simulacros', 'Primeros Auxilios', 'Capacitaciones SST']
				}
			]
		},
		{
			header: 'Estudios & Análisis',
			headerColor: 'from-blue-600 to-blue-700',
			emoji: '🔬',
			accentColor: 'blue',
			sections: [
				{
					title: 'AMBIENTE',
					icon: '🌿',
					items: ['Luxometrías', 'Sonometrías']
				},
				{
					title: 'SALUD',
					icon: '💚',
					items: ['Riesgo Psicosocial', 'Tamizajes', 'Ergonomía']
				}
			]
		},
		{
			header: 'Innovación & Tecnología',
			headerColor: 'from-blue-600 to-blue-700',
			emoji: '🚀',
			accentColor: 'blue',
			sections: [
				{
					title: 'DIGITAL',
					icon: '💻',
					items: ['Plataformas E-Learning', 'Soluciones Web']
				},
				{
					title: 'A MEDIDA',
					icon: '⭐',
					items: ['Consultoría Personalizada', 'Proyectos Especiales']
				}
			]
		}
	];

	let carouselTrack: HTMLElement;
	let isDragging = false;
	let startX = 0;
	let currentTranslate = 0;
	let prevTranslate = 0;
	let animationID: number;
	let currentIndex = 0;
	let lastInteractionTime = Date.now();
	let isAutoScrolling = true;
	let autoScrollInterval: ReturnType<typeof setInterval>;

	const INTERACTION_TIMEOUT = 5000;
	const AUTO_SCROLL_INTERVAL = 4000;

	$: extendedGroups = [...serviceGroups, ...serviceGroups, ...serviceGroups];

	function getPositionX(event: MouseEvent | TouchEvent): number {
		return 'touches' in event ? event.touches[0].clientX : event.clientX;
	}

	function animation() {
		setSliderPosition();
		if (isDragging) requestAnimationFrame(animation);
	}

	function setSliderPosition() {
		if (!carouselTrack) return;
		carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
	}

	function handleDragStart(event: MouseEvent | TouchEvent) {
		isDragging = true;
		isAutoScrolling = false;
		lastInteractionTime = Date.now();
		startX = getPositionX(event);
		animationID = requestAnimationFrame(animation);
		if (carouselTrack) carouselTrack.style.cursor = 'grabbing';
	}

	function handleDragMove(event: MouseEvent | TouchEvent) {
		if (!isDragging) return;
		const currentPosition = getPositionX(event);
		currentTranslate = prevTranslate + currentPosition - startX;
	}

	function handleDragEnd() {
		if (!isDragging) return;
		isDragging = false;
		cancelAnimationFrame(animationID);
		const movedBy = currentTranslate - prevTranslate;

		if (movedBy < -100) {
			goToNext();
		} else if (movedBy > 100) {
			goToPrev();
		} else {
			currentTranslate = prevTranslate;
			setSliderPosition();
		}

		if (carouselTrack) carouselTrack.style.cursor = 'grab';

		setTimeout(() => {
			if (Date.now() - lastInteractionTime >= INTERACTION_TIMEOUT) {
				isAutoScrolling = true;
			}
		}, INTERACTION_TIMEOUT);
	}

	function goToNext() {
		currentIndex++;
		const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 800;

		if (currentIndex >= extendedGroups.length - serviceGroups.length) {
			currentIndex = serviceGroups.length;
			currentTranslate = -currentIndex * viewportWidth;
			prevTranslate = currentTranslate;
			setSliderPosition();
			setTimeout(() => {
				currentIndex++;
				updatePosition();
			}, 50);
		} else {
			updatePosition();
		}
		resetAutoScroll();
	}

	function goToPrev() {
		currentIndex--;
		const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 800;

		if (currentIndex < 0) {
			currentIndex = extendedGroups.length - serviceGroups.length - 1;
			currentTranslate = -currentIndex * viewportWidth;
			prevTranslate = currentTranslate;
			setSliderPosition();
			setTimeout(() => {
				currentIndex--;
				updatePosition();
			}, 50);
		} else {
			updatePosition();
		}
		resetAutoScroll();
	}

	function goToIndex(index: number) {
		currentIndex = index;
		updatePosition();
		resetAutoScroll();
	}

	function updatePosition() {
		currentTranslate = -currentIndex * (typeof window !== 'undefined' ? window.innerWidth : 800);
		prevTranslate = currentTranslate;
		setSliderPosition();
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

	function handleResize() {
		updatePosition();
	}

	onMount(() => {
		currentIndex = serviceGroups.length;
		updatePosition();
		startAutoScroll();

		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('resize', handleResize);

		return () => {
			clearInterval(autoScrollInterval);
			cancelAnimationFrame(animationID);
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

{#if visible}
	<div class="relative" in:fly={{ y: 30, duration: 600 }}>
		<div class="carousel-container relative overflow-hidden">
			<div
				bind:this={carouselTrack}
				class="carousel-track flex cursor-grab"
				on:mousedown={handleDragStart}
				on:mousemove={handleDragMove}
				on:mouseup={handleDragEnd}
				on:mouseleave={handleDragEnd}
				on:touchstart={handleDragStart}
				on:touchmove={handleDragMove}
				on:touchend={handleDragEnd}
				on:mouseenter={resetAutoScroll}
				role="region"
				aria-label="Carrusel de servicios"
			>
				{#each extendedGroups as group, i}
					<div class="card-wrapper w-full shrink-0" style="min-width: 100vw; max-width: 100vw;">
						<!-- Card con mejor contraste -->
						<div
							class="relative min-h-[450px] overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 via-blue-800 to-blue-900 p-6 shadow-2xl sm:min-h-[500px] sm:p-8 md:p-10 lg:p-12"
						>
							<!-- Patrón de fondo mejorado -->
							<div class="absolute inset-0 opacity-10">
								<div
									class="absolute inset-0"
									style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 30px 30px;"
								></div>
							</div>

							<!-- Elementos decorativos sutiles -->
							<div
								class="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl"
							></div>
							<div
								class="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
							></div>

							<!-- Contenido principal -->
							<div class="relative z-10 h-full">
								<!-- Header con mejor jerarquía -->
								<div class="mb-8 sm:mb-10">
									<div class="flex items-center gap-4 sm:gap-5">
										<div
											class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-4xl backdrop-blur-sm sm:h-20 sm:w-20 sm:text-5xl"
										>
											{group.emoji}
										</div>
										<div class="min-w-0 flex-1">
											<h3
												class="mb-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl"
											>
												{group.header}
											</h3>
											<div
												class="h-1 w-20 rounded-full bg-linear-to-r from-blue-300 to-blue-400 sm:w-28"
											></div>
										</div>
									</div>
								</div>

								<!-- Grid de servicios con cards destacadas -->
								<div
									class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
								>
									{#each group.sections as section, sIndex}
										<div
											class="service-card group/card relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl hover:shadow-blue-500/30 sm:p-6"
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

											<!-- Header de la subcategoría -->
											<div class="relative z-10 mb-4 flex items-center gap-3">
												<div
													class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-400 to-blue-500 text-2xl shadow-lg transition-all duration-300 group-hover/card:scale-110 group-hover/card:rotate-6 group-hover/card:shadow-xl"
												>
													{section.icon}
												</div>
												<h4
													class="flex-1 text-sm font-bold uppercase tracking-wider text-white sm:text-base"
												>
													{section.title}
												</h4>
											</div>

											<!-- Separador -->
											<div class="mb-4 h-px bg-white/20"></div>

											<!-- Lista de items mejorada -->
											<ul class="relative z-10 space-y-3">
												{#each section.items as item}
													<li
														class="group/item flex items-start gap-3 transition-all duration-200"
													>
														<!-- Check icon mejorado -->
														<div
															class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-400/20 transition-all duration-200 group-hover/item:bg-blue-400/30 group-hover/item:scale-110"
														>
															<svg
																class="h-3 w-3 text-blue-300"
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
														<!-- Texto con mejor contraste -->
														<span
															class="min-w-0 flex-1 text-sm font-medium text-gray-100 transition-colors duration-200 group-hover/item:text-white sm:text-base"
														>
															{item}
														</span>
													</li>
												{/each}
											</ul>

											{#if section.items.length === 0}
												<div class="flex items-center justify-center py-4">
													<p class="text-sm italic text-blue-200">Próximamente</p>
												</div>
											{/if}

											<!-- Badge de contador -->
											<div
												class="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/30 backdrop-blur-sm"
											>
												<span class="text-xs font-bold text-white"
													>{section.items.length}</span
												>
											</div>

											<!-- Efecto de esquina -->
											<div
												class="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-linear-to-br from-blue-400/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
											></div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Botones de navegación mejorados -->
			<button
				on:click={goToPrev}
				class="absolute left-2 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/20 bg-white/95 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/30 hover:bg-white hover:shadow-2xl active:scale-95 sm:left-4 sm:h-14 sm:w-14"
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
				class="absolute right-2 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/20 bg-white/95 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/30 hover:bg-white hover:shadow-2xl active:scale-95 sm:right-4 sm:h-14 sm:w-14"
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
		</div>

		<!-- Indicadores mejorados -->
		<div class="mt-8 space-y-4 text-center">
			<!-- Dots con mejor visualización -->
			<div class="flex items-center justify-center gap-3">
				{#each serviceGroups as group, i}
					<button
						on:click={() => goToIndex(i + serviceGroups.length)}
						class="group relative transition-all duration-300"
						aria-label={`Ir a ${group.header}`}
					>
						<!-- Dot principal -->
						<div
							class="relative h-3 rounded-full transition-all duration-300 {currentIndex %
								serviceGroups.length ===
							i
								? 'w-12 bg-blue-600 shadow-lg shadow-blue-600/50'
								: 'w-3 bg-gray-300 hover:bg-gray-400'}"
						></div>

						<!-- Tooltip -->
						<div
							class="pointer-events-none absolute -top-12 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-blue-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100"
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
					{(currentIndex % serviceGroups.length) + 1} / {serviceGroups.length}
				</span>
				<span class="text-gray-400">•</span>
				<div class="flex items-center gap-2">
					<div
						class="h-2 w-2 rounded-full transition-all duration-300"
						class:bg-green-500={isAutoScrolling}
						class:bg-gray-400={!isAutoScrolling}
						class:animate-pulse={isAutoScrolling}
					></div>
					<span class="text-xs">{isAutoScrolling ? 'Auto' : 'Pausado'}</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.carousel-track {
		transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;
	}

	.carousel-track:active {
		cursor: grabbing !important;
	}

	.card-wrapper {
		box-sizing: border-box;
	}

	.carousel-container {
		max-width: 100vw;
		overflow-x: hidden;
	}

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
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		opacity: 0;
		transition: opacity 0.3s;
	}

	.service-card:hover::before {
		opacity: 1;
	}

	@media (hover: none) {
		.carousel-track {
			cursor: default;
		}
	}

	@media (max-width: 640px) {
		.card-wrapper {
			padding: 0;
		}
	}
</style>