<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	interface Characteristic {
		icon: string;
		title: string;
		description: string;
	}

	export let visible = false;
	export let characteristics: Characteristic[] = [];

	let isPaused = false;
	let carouselSpeed = 15; // segundos

	// Función para el efecto 3D basado en la posición del mouse
	function handleMouseMove(event: MouseEvent, element: HTMLElement) {
		const card = element.querySelector('.card-inner') as HTMLElement;
		if (!card) return;
		
		const rect = card.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		// Valores de rotación más sutiles
		const rotateX = ((y - centerY) / centerY) * 8; // máximo 8 grados
		const rotateY = ((centerX - x) / centerX) * 8; // máximo 8 grados

		// Aplicar transformación 3D
		card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
	}

	function handleMouseLeave(element: HTMLElement) {
		const card = element.querySelector('.card-inner') as HTMLElement;
		if (!card) return;
		
		card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
	}
</script>

{#if visible}
	<div class="relative mt-16" in:fly={{ y: 50, duration: 800, delay: 400 }}>
		<!-- Contenedor con mask CSS en lugar de divs -->
		<div 
			class="relative py-8 overflow-hidden carousel-container"
			style="
				-webkit-mask-image: linear-gradient(to right, transparent, black 128px, black calc(100% - 128px), transparent);
				mask-image: linear-gradient(to right, transparent, black 128px, black calc(100% - 128px), transparent);
			"
		>
			<!-- Track del carrusel -->
			<div
				class="carousel-track flex gap-8 px-4"
				class:animate-scroll={!isPaused}
				style="animation-duration: {carouselSpeed}s;"
			>
				{#each [...characteristics, ...characteristics] as char, i}
					<div
						class="card-3d-wrapper w-80 shrink-0 cursor-pointer perspective-container"
						on:mousemove={(e) => handleMouseMove(e, e.currentTarget)}
						on:mouseleave={(e) => handleMouseLeave(e.currentTarget)}
						role="button"
						tabindex="0"
					>
<div
							class="card-inner group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:border-blue-500"
						>
							<!-- Gradiente de profundidad -->
							<div
								class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							></div>

							<!-- Contenido -->
							<div class="relative z-10">
								<div class="flex items-start space-x-4">
									<!-- Icono con efecto 3D -->
									<div
										class="icon-3d flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-3xl shadow-lg"
									>
										<span
											class="icon-inner block transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
										>
											{char.icon}
										</span>
									</div>

									<!-- Contenido -->
									<div class="flex-1">
										<h4
											class="mb-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600"
										>
											{char.title}
										</h4>
										<p class="text-sm leading-relaxed text-gray-600">
											{char.description}
										</p>
									</div>
								</div>

								<!-- Indicador de número -->
								<div
									class="mt-4 border-t border-gray-200 pt-4 transition-colors duration-300 group-hover:border-blue-200"
								>
									<span class="text-xs font-semibold text-blue-500">
										{String((i % characteristics.length) + 1).padStart(2, '0')}
									</span>
								</div>
							</div>

							<!-- Sombra 3D mejorada -->
							<div
								class="card-shadow absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
							></div>

							<!-- Brillo que sigue al mouse -->
							<div class="card-shine pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<div class="shine-layer absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
							</div>
						</div>					</div>
				{/each}
			</div>
		</div>

		<!-- Indicador -->
		<div class="mt-8 text-center">
			<p class="flex items-center justify-center gap-2 text-sm text-gray-500 italic">
				<span class="text-lg">🎴</span>
				Mueve el cursor sobre las tarjetas para ver el efecto 3D
			</p>
		</div>
	</div>
{/if}

<style>
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	.animate-scroll {
		animation: scroll linear infinite;
	}

	.animate-scroll:hover {
		animation-play-state: paused;
	}

	.carousel-track {
		will-change: transform;
	}

	/* Contenedor con perspectiva */
	.perspective-container {
		perspective: 1000px;
	}

	/* Card 3D */
	.card-inner {
		transform-style: preserve-3d;
		backface-visibility: hidden;
		will-change: transform;
		transition: transform 0.1s ease-out, box-shadow 0.3s ease;
	}

	/* Icono con profundidad */
	.icon-3d {
		transform: translateZ(20px);
		transition: transform 0.3s ease;
	}

	.card-inner:hover .icon-3d {
		transform: translateZ(30px);
	}

	/* Sombra dinámica */
	.card-shadow {
		transform: translateZ(-20px);
	}

	/* Elementos con profundidad */
	.card-inner h4 {
		transform: translateZ(15px);
	}

	.card-inner p {
		transform: translateZ(10px);
	}

	/* Animación de respiración */
	@keyframes breathe {
		0%, 100% {
			box-shadow: 0 10px 40px rgba(59, 130, 246, 0.15);
		}
		50% {
			box-shadow: 0 20px 60px rgba(59, 130, 246, 0.25);
		}
	}

	.card-inner:hover {
		animation: breathe 2s ease-in-out infinite;
	}

	/* Brillo suave */
	.shine-layer {
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.card-inner:hover .shine-layer {
		opacity: 1;
	}
</style>