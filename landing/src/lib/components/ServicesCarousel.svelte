<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

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

	// Datos de servicios - Tonalidades del mismo azul
	const serviceGroups: ServiceGroup[] = [
		{
			header: 'Consultoría & Asesoría',
			headerColor: 'from-blue-700 to-blue-800',
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
			headerColor: 'from-blue-500 to-blue-600',
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
			headerColor: 'from-blue-400 to-blue-500',
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

	// Obtener ancho dinámico de la card - Ocupa todo el carousel
	function getCardWidth(): number {
		if (typeof window === 'undefined') return 800;
		return window.innerWidth;
	}

	let cardWidth = 800;

	// Crear array extendido para scroll infinito
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

		if (carouselTrack) {
			carouselTrack.style.cursor = 'grabbing';
		}
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

		if (carouselTrack) {
			carouselTrack.style.cursor = 'grab';
		}

		setTimeout(() => {
			if (Date.now() - lastInteractionTime >= INTERACTION_TIMEOUT) {
				isAutoScrolling = true;
			}
		}, INTERACTION_TIMEOUT);
	}

	function goToNext() {
		currentIndex++;

		if (currentIndex >= extendedGroups.length - serviceGroups.length) {
			currentIndex = serviceGroups.length;
			currentTranslate = -currentIndex * cardWidth;
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

		if (currentIndex < 0) {
			currentIndex = extendedGroups.length - serviceGroups.length - 1;
			currentTranslate = -currentIndex * cardWidth;
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
		currentTranslate = -currentIndex * cardWidth;
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
		cardWidth = getCardWidth();
		updatePosition();
	}

	onMount(() => {
		cardWidth = getCardWidth();
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
	<div class="relative py-4" in:fly={{ y: 30, duration: 600 }}>
		<!-- Contenedor sin mask -->
		<div class="carousel-container relative overflow-hidden py-4">
			<!-- Track del carrusel -->
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
					<div 
						class="card-wrapper shrink-0" 
						style="width: {cardWidth}px;"
						role="presentation"
					>
						<!-- Card Full Width con gradiente azul sutil -->
						<div
							class="relative h-full min-h-[500px] overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 to-blue-950 p-8 shadow-2xl sm:p-12"
						>
							<!-- Patrón de fondo sutil -->
							<div class="absolute inset-0 opacity-5">
								<div
									class="absolute inset-0"
									style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;"
								></div>
							</div>

							<!-- Elementos decorativos flotantes -->
							<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
							<div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl"></div>

							<!-- Contenido -->
							<div class="relative z-10">
								<!-- Header del servicio -->
								<div class="mb-8 text-center">
									<div class="mb-4 flex items-center justify-center gap-3">
										<span class="text-6xl">{group.emoji}</span>
									</div>
									<h3 class="mb-2 text-3xl font-bold text-white sm:text-4xl">
										{group.header}
									</h3>
									<div class="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-blue-400 to-blue-600"></div>
								</div>

								<!-- Grid de servicios con glassmorphism -->
								<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
									{#each group.sections as section, sIndex}
										<div
											class="group/glass relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-500/20"
											in:fly={{ y: 20, duration: 400, delay: sIndex * 100 }}
										>
											<!-- Gradiente interno sutil -->
											<div
												class="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover/glass:opacity-100"
											></div>

											<!-- Icono flotante -->
											<div class="relative z-10 mb-4 flex items-center gap-3">
												<div
													class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-400 to-blue-600 text-2xl shadow-lg transition-transform duration-300 group-hover/glass:scale-110 group-hover/glass:rotate-6"
												>
													{section.icon}
												</div>
												<h4 class="text-sm font-bold uppercase tracking-wide text-blue-300">
													{section.title}
												</h4>
											</div>

											<!-- Lista de items -->
											<ul class="relative z-10 space-y-2">
												{#each section.items as item}
													<li class="flex items-start gap-2 text-sm text-gray-300 transition-colors duration-200 group-hover/glass:text-white">
														<svg class="mt-1 h-4 w-4 shrink-0 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
															<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
														</svg>
														<span class="flex-1">{item}</span>
													</li>
												{/each}
											</ul>

											{#if section.items.length === 0}
												<p class="text-sm italic text-gray-400">Próximamente</p>
											{/if}

											<!-- Brillo en hover -->
											<div
												class="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/glass:opacity-100"
											></div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Botones de navegación (igual estilo que CarouselInfinito) -->
			<button
				on:click={goToPrev}
				class="absolute left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-xl active:scale-95"
				aria-label="Anterior"
			>
				<svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<button
				on:click={goToNext}
				class="absolute right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-xl active:scale-95"
				aria-label="Siguiente"
			>
				<svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>

		<!-- Indicadores -->
		<div class="mt-6 text-center">
			<!-- Dots -->
			<div class="flex items-center justify-center gap-2">
				{#each serviceGroups as group, i}
					<button
						on:click={() => goToIndex(i + serviceGroups.length)}
						class="group relative transition-all duration-300"
						aria-label={`Ir a ${group.header}`}
					>
						<div
							class="h-2 rounded-full transition-all duration-300 {currentIndex % serviceGroups.length === i
								? 'w-8 bg-blue-600'
								: 'w-2 bg-gray-300 hover:bg-gray-400'}"
						></div>
					</button>
				{/each}
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

	/* Line clamp */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Mejora del scroll en móviles */
	@media (hover: none) {
		.carousel-track {
			cursor: default;
		}
	}
</style>
